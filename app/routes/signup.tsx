import {Form} from "@remix-run/react";
import {Button, Input} from "@nextui-org/react";
import {ActionFunctionArgs, redirect} from "@remix-run/node";
import {prisma} from "~/prisma.service";

export const action = async (c:ActionFunctionArgs)=>{
  const formData = await c.request.formData();
  const username = formData.get('username') as string
  const password = formData.get('password') as string
  await prisma.user.create({
    data: {
      username: username,
      password: password,
    }
  })
  return redirect('/signup')
}
export default function Page() {
  return (
    <Form method={'POST'}>
      <div className={'p-12 flex flex-col gap-3'}>
        <Input label="用户名" name="username" />
        <Input label="密码" name="password" type="password"/>
        <Button type="submit" color="primary">
          注册
        </Button>
      </div>
    </Form>
  )
}
