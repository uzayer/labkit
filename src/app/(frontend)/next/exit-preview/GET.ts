export async function GET(): Promise<Response> {
  return new Response('Method Not Allowed', {
    status: 405,
    headers: {
      Allow: 'POST',
    },
  })
}
