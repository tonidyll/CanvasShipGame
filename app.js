//https://www.youtube.com/watch?v=eI9idPTT0c4
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
canvas.width = innerWidth
canvas.height = innerHeight

const scoreSp = document.querySelector('#score')
const easyBtn = document.querySelector('#easyBtn')
const mediumBtn = document.querySelector('#mediumBtn')
const hardBtn = document.querySelector('#hardBtn')
const extremeBtn = document.querySelector('#extremeBtn')

const modalEl = document.querySelector('#modalEl')
const modalSc = document.querySelector('#modalSc')

let multiplier = 1
let refresh = 1000

const background = new Image()
background.src='./assets/img/pixelSpace.jpg'
class Player {
    constructor(x, y, radius, color) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        //this.image= image
    }
    draw() {
        //ctx.drawImage(this.Image,this.x,this.y,this.radius)
        ctx.beginPath()
        ctx.arc(
            this.x, this.y, this.radius,
            0, Math.PI * 2, false
        )
        ctx.fillStyle = this.color
        ctx.fill()
    }
}

class Protectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }
    draw() {
        ctx.beginPath()
        ctx.arc(
            this.x, this.y, this.radius,
            0, Math.PI * 2, false
        )
        ctx.fillStyle = this.color
        ctx.fill()
    }
    update() {
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }

}
class Enemy {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }
    draw() {
        ctx.beginPath()
        ctx.arc(
            this.x, this.y, this.radius,
            0, Math.PI * 2, false
        )
        ctx.fillStyle = this.color
        ctx.fill()
    }
    update() {
        this.draw()
        this.x = (this.x + this.velocity.x * multiplier)
        this.y = (this.y + this.velocity.y * multiplier)
    }

}
let x = canvas.width / 2
let y = canvas.height / 2

let player = new Player(x, y, 30, 'blue')
let projectiles = []
let enemies = []

function init() {
    player = new Player(x, y, 30, 'blue')
    projectiles = []
    enemies = []
    score=0
    scoreSp.innerHTML= score
    modalSc.innerHTML= score
}


function spawnEnemies(refresh) {
    //hacer math . random * todos los tipos de enemigo que hayan, y hacer un if
    //que, segun el tipo de enemigo que toque se le asignen unas propiedades u otras
    //al objeto
    stopPlaying();
    setInterval(() => {
        const radius = Math.random() * 30 + 15;
        let x
        let y
        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
            y = Math.random() * canvas.height
        }
        else {
            x = Math.random() * canvas.width
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
        }

        const color = `hsl(${Math.random() * 360},50%,50%)`;
        const angle = Math.atan2(
            canvas.height / 2 - y,
            canvas.width / 2 - x
        )
        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }
        enemies.push(new Enemy(x, y, radius, color, velocity))

    },
       refresh)
}

function stopPlaying() {
    // Get a reference to the last interval + 1
    const interval_id = window.setInterval(function () { }, Number.MAX_SAFE_INTEGER);
    // Clear any timeout/interval up to that id
    for (let i = 1; i < interval_id; i++) {
        window.clearInterval(i);
    }
}

let animationID
let score = 0
function animate() {

    player.draw();
    //"animationID" makes reference to THIS actual frame
    animationID = requestAnimationFrame(animate)

   //ctx.drawImage(background,0,0,canvas.width,canvas.height)
   ctx.fillStyle = 'rgba(0,0,0,0.1)' 
   //ctx.fillStyle = 'rgba(255,255,255,0.1)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    player.draw();
    projectiles.forEach((projectile, index) => {
        projectile.update()
        if (projectile.x - projectile.radius < 0 ||
            projectile.x - projectile.radius > canvas.width ||
            projectile.y + projectile.radius < 0 ||
            projectile.y - projectile.radius > canvas.height) {
            setTimeout(() => {
                projectiles.splice(index, 1)
            }, 0)
        }
    })
    //Set index to specify the index of the array to work with
    enemies.forEach((enemy, index) => {
        enemy.update()

        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y) // get the distance between two elements
        //end game
        if (dist - enemy.radius - player.radius < 1) {
            //passing "animationID" as a value we specify wich frame we want to stop (The actual one)
            cancelAnimationFrame(animationID); //cancelanimationframe stops the actual animation
            modalEl.style.display = 'flex'
            modalSc.innerHTML = score
            console.log('end')
        }
        projectiles.forEach((projectile, projectileIndex) => {
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)
            //objects touch && remove from canvas
            if (dist - enemy.radius - projectile.radius < 1) {

                //increse score

                //removes projectile and enemy from canvas
                setTimeout(() => {
                    score += 100
                    scoreSp.innerHTML = score
                    enemies.splice(index, 1)
                    projectiles.splice(projectileIndex, 1)
                }, 0)


            }
        })
    })
}

addEventListener('click', (e) => {
    console.log(projectiles)
    const angle = Math.atan2(
        e.clientY - canvas.height / 2,
        e.clientX - canvas.width / 2
    )
    const velocity = {
        x: Math.cos(angle) * 6,
        y: Math.sin(angle) * 6
    }
    projectiles.push(
        new Protectile(canvas.width / 2, canvas.height / 2,
            5, 'red', velocity))
})
easyBtn.addEventListener('click', () => {
    refresh=800
    multiplier = 5
    init()
    animate()
    spawnEnemies(refresh)
    modalEl.style.display = 'none'
})
mediumBtn.addEventListener('click', () => {
    refresh=600
    multiplier=5;
    init()
    animate()
    spawnEnemies(refresh)
    modalEl.style.display = 'none'
})
hardBtn.addEventListener('click', () => {
    refresh=500
    multiplier=6;
    init()
    animate()
    spawnEnemies(refresh)
    modalEl.style.display = 'none'
})
extremeBtn.addEventListener('click', () => {
    refresh=550
    multiplier=9;
    init()
    animate()
    spawnEnemies(refresh)
    modalEl.style.display = 'none'
})
