export function jsonError(message: string, status = 400) {
  return Response.json({ success: false, message }, { status });
}

export function jsonSuccess<T>(data: T, status = 200) {
  return Response.json({ success: true, data }, { status });
}
