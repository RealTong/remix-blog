import {prisma} from "~/prisma.service";
import {json, Link, useLoaderData, useSearchParams} from "@remix-run/react";
import {LoaderFunctionArgs} from "@remix-run/node";
import {Pagination} from "@nextui-org/react";

export const loader = async (c: LoaderFunctionArgs) => {
  const search = new URL(c.request.url).searchParams
  const page = Number(search.get('page') || 1)

  const [posts, total] = await prisma.$transaction([
    prisma.post.findMany({
      orderBy: {
        created_at: "desc"
      },
      take: 1,
      skip: (page - 1) * 1
    }),
    prisma.post.count()
  ])

  return json({
    posts,
    pageCount: Math.ceil(total / 1)
  })
}

export default function Index() {
  const loaderData = useLoaderData<typeof loader>()

  // 读取 url param
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Number(searchParams.get('page') || 1)

  return (
    <div>
      <div className={'p-12 flex flex-col gap-4'}>
        {
          loaderData.posts.map(post => {
            return (
              <div key={post.id}>
                <Link to={`/posts/${post.id}`} className={'text-xl'}>
                  {post.title}
                </Link>
                <div className={'text-sm text-gray-400'}>
                  {post.created_at}
                </div>
              </div>
            )
          })
        }
        <Pagination total={loaderData.pageCount} page={page} onChange={page => {
          const newSearchParams = new URLSearchParams(searchParams)
          newSearchParams.set('page', String(page))
          setSearchParams(newSearchParams)
        }}/>
      </div>
    </div>
  );
}
