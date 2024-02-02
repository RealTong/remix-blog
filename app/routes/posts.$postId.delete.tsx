import {ActionFunctionArgs, redirect} from "@remix-run/node";
import {prisma} from "~/prisma.service";

export const action = async (c:ActionFunctionArgs) => {
  const id = c.params.postId as string

  await prisma.post.delete({
    where:{
      id
    }
  })
  return redirect('/')
}
