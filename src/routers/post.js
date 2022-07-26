const { v1: uuidv1 } = require('uuid')
const express = require('express')
const { getPostsCollection } = require('../mongo')
const { redirectWithMsg } = require('../util')
const router = express.Router()

router.post('/', async (req, res) => {
  if (!req.user) {
    res.status(403).end()
    return
  }
  const posts = await getPostsCollection()
  // Contains key-value pairs of data submitted in the request body
  // req.body:  { content: 'huuuu' }
  console.log('req.body: ', req.body)
  const { content } = req.body
  await posts.insertOne({
    id: uuidv1(),
    userId: req.user.id,
    content,
    createdAt: new Date(),
  })

  redirectWithMsg({
    res,
    dest: '/',
    info: '포스트가 작성되었습니다.',
  })
})

// router.delete x  -> router.post
router.post('/:postId/delete', async (req, res) => {
  // /: 뒤
  console.log('req.params: ', req.params)
  console.log('req.body: ', req.body)
  console.log('req.user: ', req.user)

  const { postId } = req.params

  const posts = await getPostsCollection()

  const existingPost = await posts.findOne({
    id: postId,
  })

  // req.user
  if (existingPost.userId !== req.user.id) {
    res.status(403).end()
    return
  }

  posts.deleteOne({
    id: postId,
  })

  redirectWithMsg({
    res,
    dest: '/',
    info: '포스트가 삭제되었습니다.',
  })
})

router.post('/:postId/update', async (req, res) => {
  const { postId } = req.params
  const { content } = req.body
  const posts = await getPostsCollection()

  const existingPost = await posts.findOne({
    id: postId,
  })

  // req.user
  if (existingPost.userId !== req.user.id) {
    res.status(403).end()
    return
  }

  posts.updateOne(
    {
      id: postId,
    },
    {
      $set: {
        content,
      },
    }
  )

  redirectWithMsg({
    res,
    dest: '/',
    info: '포스트가 업데이트되었습니다.',
  })
})

module.exports = router
