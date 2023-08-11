function minuteToMiliseconds(minute: number) {
  return minute * 60 * 1000
}

describe('Timer', () => {
  it('homepage render timer component', () => {
    cy.visit('http://localhost:3000/')
    cy.get('button').contains('Timer')
    cy.get('p').contains('Timer')
  })

  beforeEach(() => {
    cy.request('POST', 'http://localhost:3000/api/reset')
  })

  it('can do 10 mins pomodoro', () => {
    // configure date
    const date = new Date()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    cy.log('start time', hour, minute, second)

    cy.clock(date)
    cy.visit('http://localhost:3000/')

    // create task name
    const uuid = () => Cypress._.random(0, 1e6)
    const taskId = uuid()
    cy.get('input[placeholder="Task Name"]').type(`Task ${taskId}`)

    // select 10 mins
    cy.get('button').contains('10 menit').click()
    cy.get('button').contains(/^START$/).click()
    cy.tick(minuteToMiliseconds(10))

    // validate task name and duration
    cy.contains(`Task ${taskId}`)
    cy.get('td').contains('10 menit')

    const padSecond = second.toString().padStart(2, '0')
    cy.get('td').contains(`${hour}:${minute}:${padSecond}`)
    cy.get('td').contains(`${hour}:${minute + 10}:${padSecond}`)
  })

  it('can do 10 mins pomodoro with single pause and resume', () => {
    // configure date
    const date = new Date()
    const startHour = date.getHours()
    const startMinute = date.getMinutes()
    const startSecond = date.getSeconds()
    cy.log('start time', startHour, startMinute, startSecond)

    cy.clock(date)
    cy.visit('http://localhost:3000/')

    // create task name
    const uuid = () => Cypress._.random(0, 1e6)
    const taskId = uuid()
    cy.get('input[placeholder="Task Name"]').type(`Task ${taskId}`)

    // select 10 minutes
    cy.get('button').contains('10 menit').click()
    cy.get('button').contains(/^START$/).click()

    // spent 6 minutes
    cy.tick(minuteToMiliseconds(6))

    // pause, 4 minute left
    cy.get('button').contains('PAUSE').click()
    cy.get('p').contains('00:04:00')

    // wait 1 minute
    cy.tick(minuteToMiliseconds(1))

    // resume
    cy.get('button').contains(/^START$/).click()

    // spent 4 minutes
    cy.tick(minuteToMiliseconds(4))

    // validate task name and duration
    cy.contains(`Task ${taskId}`)
    cy.get('td').contains('6 menit')
    cy.get('td').next().contains('4 menit')
    cy.get('td').contains(`${startHour}:${startMinute}:${startSecond.toString().padStart(2, '0')}`)
    cy.get('td').contains(`${startHour}:${startMinute + 6}:${startSecond.toString().padStart(2, '0')}`)
    cy.get('td').contains(`${startHour}:${startMinute + 7}:${startSecond.toString().padStart(2, '0')}`)
    cy.get('td').contains(`${startHour}:${startMinute + 11}:${startSecond.toString().padStart(2, '0')}`)
  })

  it('can do 10 mins pomodoro with multiple pause and resume', () => {
    // configure date
    const date = new Date()
    const startHour = date.getHours()
    const startMinute = date.getMinutes()
    const startSecond = date.getSeconds()
    cy.log('start time', startHour, startMinute, startSecond)

    cy.clock(date)
    cy.visit('http://localhost:3000/')

    // create task name
    const uuid = () => Cypress._.random(0, 1e6)
    const taskId = uuid()
    cy.get('input[placeholder="Task Name"]').type(`Task ${taskId}`)

    // select 10 minutes
    cy.get('button').contains('10 menit').click()
    cy.get('button').contains(/^START$/).click()

    // spent 5 minutes
    cy.tick(minuteToMiliseconds(5))

    // pause, 5 minute left
    cy.get('button').contains('PAUSE').click()
    cy.get('p').contains('00:05:00')

    // wait 1 minute
    cy.tick(minuteToMiliseconds(1))

    // resume
    cy.get('button').contains(/^START$/).click()

    // spent 2 minutes
    cy.tick(minuteToMiliseconds(2))

    // pause, 3 minute left
    cy.get('button').contains('PAUSE').click()
    cy.get('p').contains('00:03:00')

    // wait 1 minute
    cy.tick(minuteToMiliseconds(1))

    // resume
    cy.get('button').contains(/^START$/).click()

    // spent 1 minutes
    cy.tick(minuteToMiliseconds(1))

    // pause, 2 minute left
    cy.get('button').contains('PAUSE').click()
    cy.get('p').contains('00:02:00')

    // wait 1 minute
    cy.tick(minuteToMiliseconds(1))

    // resume
    cy.get('button').contains(/^START$/).click()

    // spent 2 minute
    cy.tick(minuteToMiliseconds(2))

    // validate task name and duration
    cy.contains(`Task ${taskId}`)

    cy.get('tr').eq(1).contains('5 menit')
    cy.get('tr').eq(2).contains('2 menit')
    cy.get('tr').eq(3).contains('1 menit')
    cy.get('tr').eq(4).contains('2 menit')

    const padSecond = startSecond.toString().padStart(2, '0')

    cy.get('td').contains(`${startHour}:${startMinute}:${padSecond}`)
    cy.get('td').contains(`${startHour}:${startMinute + 5}:${padSecond}`)

    cy.get('td').contains(`${startHour}:${startMinute + 6}:${padSecond}`)
    cy.get('td').contains(`${startHour}:${startMinute + 8}:${padSecond}`)
    
    cy.get('td').contains(`${startHour}:${startMinute + 9}:${padSecond}`)
    cy.get('td').contains(`${startHour}:${startMinute + 11}:${padSecond}`)

    cy.get('td').contains(`${startHour}:${startMinute + 10}:${padSecond}`)
    cy.get('td').contains(`${startHour}:${startMinute + 13}:${padSecond}`)
  })
})