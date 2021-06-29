import mocha from 'mocha'
import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'

const should = chai.should()
const { describe, it, beforeEach } = mocha

chai.use(chaiHttp)

const urlBase = 'http://localhost:3000'
const prefix = '/api/v1'

const userCount = 100

async function createUser (userName) {
  const createRes = await chai
    .request(`${urlBase}${prefix}`)
    .post('/users/create')
    .send({
      userName,
      age: Math.floor(Math.random() * 30) + 10,
    })
  return createRes
}

async function addScore (userId) {
  const addScoreRes = await chai
    .request(`${urlBase}${prefix}`)
    .post('/score/add')
    .send({
      userId,
      score: Math.floor(Math.random() * 3000) + 1000,
    })
  return addScoreRes
}

function createAndAddScore (userName) {
  describe(`Create and Add Score randomly for ${userName}`, async () => {
    it(`creating user ${userName}`, async () => {
      const createRes = await createUser(userName)

      expect(createRes.statusCode).to.equal(200)
      expect(createRes.body.success).to.equal(true)

      console.log('createRes: ', createRes.body.data._id)

      describe('adding score', async () => {
        it(`adding score for ${userName}`, async () => {
          const addScoreRes = await addScore(createRes.body.data._id)

          expect(addScoreRes.statusCode).to.equal(200)
          expect(addScoreRes.body.success).to.equal(true)
        })
      })
    })
  })
}

for (let i = 1; i <= userCount; i += 1) {
  createAndAddScore(`TestUser${Date.now().toString()}${i}`)
}
