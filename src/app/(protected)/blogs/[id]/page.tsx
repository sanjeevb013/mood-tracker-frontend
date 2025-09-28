interface BlogPageProps {
  params: { id: string }
}

export default function BlogPage({ params }: BlogPageProps) {
  return <h1>Blog ID: {params.id} </h1>;
}
