import {ActionFunctionArgs, LoaderFunctionArgs, redirect} from "@remix-run/node";
import {prisma} from "~/prisma.service";
import {json, Link, useLoaderData} from "@remix-run/react";
import ReactMarkdown from 'react-markdown'

export const loader = async (c: LoaderFunctionArgs) => {
  const postId = c.params.postId as string
  const post = await prisma.post.findUnique({
    where: {
      id: postId
    }
  })

  if (!post) {
    throw new Response("找不到文章", {
      status: 404
    })
  }
  return json({
    post
  })
}

export const action = async (c: ActionFunctionArgs) => {
  const postId = c.params.postId as string;
  const formData = await c.request.formData()

  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const slug = formData.get("slug") as string

  await prisma.post.update({
    where: {
      id: postId
    },
    data: {
      id: slug,
      content,
      title
    }
  })

  return redirect(`/posts/${slug}`)
}

export default function Page() {
  const loaderData = useLoaderData<typeof loader>()
  return (
    <div className={'p-12'}>
      <div className={'mb-3'}>
        <Link to={'edit'} className={'underline'}>编辑</Link>
      </div>
      <div className={'prose'}>
        <h1>{loaderData.post.title}</h1>
        <ReactMarkdown>{loaderData.post.content}</ReactMarkdown>
      </div>
    </div>
  )
}
