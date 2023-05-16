export default interface Error {
  message: string,
  error_details: {
    backtrace: string,
    environment: any
  },
  application_id: string
}