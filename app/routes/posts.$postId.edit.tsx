import {ActionFunctionArgs, LoaderFunctionArgs, redirect} from "@remix-run/node";
import {prisma} from "~/prisma.service";
import {Form, json, useFetcher, useLoaderData, useNavigation, useSubmit} from "@remix-run/react";
import {Button, Input, Textarea} from "@nextui-org/react";
import {auth} from "~/routes/session.server";

export const loader = async (c: LoaderFunctionArgs) => {
  const user = await auth(c.request)
  if (!user.username){
    return redirect('/signin')
  }
  const postId = c.params.postId as string;
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
  const action = formData.get("action") as string

  if (action === 'delete') {
    // exec delete
    // return redirect("/")
  }

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

  const navigation = useNavigation()

  const isEditing = navigation.state === 'submitting' && navigation.formData?.get('action') === 'edit'
  const isDeleting = navigation.state ==='submitting' && navigation.formData?.get('action') ==='delete'
  const submit = useSubmit()
  return (
    <div className={'p-12'}>
      <Form method={"POST"}>
        <div className={'flex flex-col gap-3'}>
          <Input label={'slug'} name={'slug'} defaultValue={loaderData.post.id}/>
          <Input label={'标题'} name={'title'} defaultValue={loaderData.post.title}/>
          <Textarea minRows={10} label={'正文'} name={'content'} defaultValue={loaderData.post.content}/>
          <Button name={'action'} type={'submit'} value={'edit'} color={'primary'} isLoading={isEditing}>更新</Button>
          <Button name={'action'} value={'delete'} color={'danger'} isLoading={isDeleting}
                  onClick={() => {
                    if (confirm("确定删除吗？")) {
                      const formData = new FormData()
                      formData.set('action','delete')
                      submit(formData,{
                          method: "POST",
                          action: `/posts/${loaderData.post.id}/delete`
                      })
                      // deleteFetcher.submit(null, {
                      //   method: "POST",
                      //   action: `/posts/${loaderData.post.id}/delete`
                      // })
                    }
                  }}>删除文章</Button>
        </div>
      </Form>
    </div>
  )
}
