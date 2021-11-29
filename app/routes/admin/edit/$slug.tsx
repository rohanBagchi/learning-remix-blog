import {
  useLoaderData,
  Link,
  Form,
  useActionData,
  redirect,
  useTransition,
} from "remix";
import { useNavigate } from "react-router-dom";
import type { LoaderFunction, ActionFunction } from "remix";
import { createPost, getPost } from "~/post";
import type { Post } from "~/post";
import invariant from "tiny-invariant";

export let loader: LoaderFunction = async ({ params }): Promise<Post> => {
  invariant(params.slug, "expected params.slug");
  return getPost(params.slug);
};

export let action: ActionFunction = async ({ request }) => {
  await new Promise((res) => setTimeout(res, 1000));
  let formData = await request.formData();

  let title = formData.get("title");
  let slug = formData.get("slug");
  let markdown = formData.get("markdown");

  let errors: any = {};
  if (!title) errors.title = true;
  if (!slug) errors.slug = true;
  if (!markdown) errors.markdown = true;

  if (Object.keys(errors).length) {
    return errors;
  }

  invariant(typeof title === "string");
  invariant(typeof slug === "string");
  invariant(typeof markdown === "string");

  await createPost({ title, slug, markdown });

  return redirect(`/admin/${slug}`);
};

export default function PostSlug() {
  let post = useLoaderData<Post>();
  let errors = useActionData();
  let transition = useTransition();
  let navigate = useNavigate();

  return (
    <div>
      <Form method="post">
        <p>
          <label>
            Post Title: {errors?.title && <em>Title is required</em>}{" "}
            <input type="text" name="title" defaultValue={post.title} />
          </label>
        </p>

        <input type="hidden" name="slug" defaultValue={post.slug} readOnly />
        <p>
          <label htmlFor="markdown">Markdown:</label>{" "}
          {errors?.markdown && <em>Markdown is required</em>}
          <br />
          <textarea rows={20} name="markdown" defaultValue={post.body} />
        </p>
        <p>
          <button type="button" onClick={() => navigate(`/admin/${post.slug}`)}>
            Cancel
          </button>
          <button type="submit">
            {transition.submission ? "Creating..." : "Create Post"}
          </button>
        </p>
      </Form>
    </div>
  );
}
