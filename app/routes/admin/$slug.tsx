import { useLoaderData, Link, useSubmit, Form, redirect } from "remix";
import type { LoaderFunction, ActionFunction } from "remix";
import { deletePost, getPost } from "~/post";
import invariant from "tiny-invariant";

export let loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug, "expected params.slug");
  return getPost(params.slug);
};

export let action: ActionFunction = async ({ request, params }) => {
  let formData = await request.formData();

  let slug = formData.get("slug");
  invariant(typeof slug === "string");
  await deletePost(slug);
  return redirect(`/admin`);
};

export default function PostSlug() {
  let post = useLoaderData();
  let submit = useSubmit();
  return (
    <div>
      <Link to={`/admin/edit/${post.slug}`}>Edit</Link>
      <Form method="post">
        <input type="hidden" name="slug" value={post.slug} readOnly />
        <button type="submit">Delete</button>
      </Form>
      <div dangerouslySetInnerHTML={{ __html: post.html }} />
    </div>
  );
}
