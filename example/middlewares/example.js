const middleware = async (req, res, next) => {
  const startAt = Date.now()
  const { originalUrl } = req

  res.on('finish', () => {
    const endAt = Date.now()
    const totalTime = endAt - startAt

    console.log(
      `Request to ${originalUrl}, status ${res?.statusCode}, resolved in ${totalTime}ms`
    )
  })

  next()
}

export default middleware
