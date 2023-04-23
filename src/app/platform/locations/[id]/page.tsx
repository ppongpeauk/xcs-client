export default function Location({ params }: {params: { id: string }}) {
  return (
    <div>
      <h1>Location {params.id}</h1>
    </div>
  )
}