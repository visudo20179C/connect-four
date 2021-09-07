<template>
	<div class="bg-gray-400">
		<div>
			<div class="ml-auto mr-auto pt-10 grid grid-rows-8 row-span-8 ml-4 w-3/5">
				<div class="flex flex-nowrap ml-auto mr-auto">
					<div class="mt-8 mr-4">
						<button class="bg-gray-200 hover:bg-gray-100 text-blue-900 font-semibold py-2 px-4 border border-blue-900 rounded shadow" @click="newGame()">
							New Game
						</button>
					</div>
					<div class="border-2 rounded-lg h-20 w-60 mt-2 mb-5 ml-auto mr-auto text-center bg-blue-900 border-yellow-300">
						<div class="text-2xl mt-4">
							<div v-if="gameOverCompute">
								<div v-if="this.page.winner == 1">
									<div class="text-red-700 font-black">
										{{winnerCompute}} Won!
									</div>
								</div>
								<div v-else>
									<div class="text-yellow-300 font-black">
										{{winnerCompute}} Won!
									</div>
								</div>
							</div>
							<div v-else>
								<div v-if="!this.page.connectedWithOther" class="text-gray-400">
									Not connected	
								</div>
								<div v-else>
									<div v-if="this.page.turn == 1" class="text-red-700 font-black">
										{{turn}}
									</div>
									<div v-else class="text-yellow-300 font-black">
										{{turn}}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div v-if="this.socket.connected && !this.page.connectedWithOther" class="mb-2 ml-auto mr-auto">
					<div class="h-6 mb-4 font-semibold text-center bg-gray-200 text-blue-900 border border-blue-900 rounded shadow">
						ClientID: {{clientId}}
						<input type="hidden" id="copyClientId" :value="clientId">
						<button class="w-16 h-6 bg-blue-900 text-white float-right text-sm" @click="copyClientId()">Copy</button>
					</div>
					<div class="flex flex-nowrap">
						<input class="w-64 bg-gray-200 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border border-blue-900 rounded" v-model="page.socketIdToJoin" placeholder="Enter ClientID to join"></input>
						<div class="w-32 ml-4 bg-gray-200 hover:bg-gray-100 text-blue-900 py-2 px-4 border border-blue-900 rounded shadow">
							<button @click="joinGame()" class="font-semibold">
								Join Game
							</button>
						</div>
					</div>
				</div>
				<div v-if="this.page.connectedWithOther">
					<div class="w-1/2 ml-auto mr-auto mb-5 font-semibold bg-gray-200 text-blue-900 border border-blue-900 rounded shadow">
						You are connected with another Player.
					</div>
					<div class="w-1/2 ml-auto mr-auto mb-5 font-semibold bg-gray-200 text-blue-900 border border-blue-900 rounded shadow">
						{{turnCompute}}
					</div>
				</div>
				<div class="container border-2 rounded-lg border-yellow-300 bg-blue-900 max-w-2xl mr-auto ml-auto mb-20">
					<div class="ml-auto mr-auto max-w-xl max-h-16 mb-4 mt-4 bg-blue-900" v-for="(item, index) in this.page.board">
						<div class="grid grid-cols-8">
							<div v-for="(i, nested_index) in item" class="ml-auto mr-auto">
								<div v-if="i == 1">
									<div class="border-2 rounded-lg h-16 w-16 border-yellow-300 bg-red-700 cursor-not-allowed"></div>
								</div>
								<div v-else-if="i == -1">
									<div class="border-2 rounded-lg h-16 w-16 border-yellow-300 bg-yellow-300 cursor-not-allowed"></div>
								</div>
								<div v-else>
									<div v-if="index == 7 || index !== 0 && valueBelow(index, nested_index) || index == 0 && valueBelow(index, nested_index)">
										<div v-if="gameOverCompute == false">
											<div v-if="page.turn == 0 && page.playerYellow == socket.id">
												<button @click="placeMove(index, nested_index)">
													<div class="border-2 rounded-lg h-16 w-16 border-yellow-300 bg-gray-400"></div>
												</button>
											</div>
											<div v-else-if="page.turn == 1 && page.playerRed == socket.id">
												<button @click="placeMove(index, nested_index)">
													<div class="border-2 rounded-lg h-16 w-16 border-yellow-300 bg-gray-400"></div>
												</button>
											</div>
											<div v-else>
												<div class="border-2 rounded-lg h-16 w-16 border-yellow-300 bg-gray-400 cursor-not-allowed"></div>
											</div>
										</div>
										<div v-else>
											<div class="border-2 rounded-lg h-16 w-16 border-yellow-300 bg-gray-400 cursor-not-allowed"></div>
										</div>
									</div>
									<div v-else>
										<div class="border-2 rounded-lg h-16 w-16 border-yellow-300 bg-gray-400 cursor-not-allowed"></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import io from "socket.io-client"

export default {
	name: "ConnectFour",
	data() {
		return {
			socket: {},
			page: {
				board: [],
				room: null,
				turn: null,
				gameWon: null,
				winner: null,
				playerYellow: null,
				playerRed: null,
				socketIdToJoin: null,
				connectedWithOther: null,
			}
		}
	},
	computed: {
		turn() {
			return (this.page.turn == 1)
				? "It's Red's Turn"
				: "It's Yellow's Turn"
		},
		turnCompute() {
			if(this.page.turn == 1 && this.page.playerRed == this.socket.id) {
				return "It is your turn."
			}
			else if(this.page.turn == 0 && this.page.playerYellow == this.socket.id) {
				return "It is your turn."
			}
			else {
				return "It is your opponent's turn."
			}
		},
		gameOverCompute() {
			return (this.page.gameWon == true)
				? true
				: false
		},
		winnerCompute() {
			return (this.page.winner == 1)
				? "Red"
				: "Yellow"
		},
		clientId() {
			return (this.socket.id !== undefined)
				? this.socket.id
				: "not connected"
		},
		roomId() {
			return (this.page.room !== undefined)
				? this.page.room
				: "not connected"
		},
	},
	methods: {
		createBoard() {
			this.page.board = []
			this.page.gameWon = false
			this.page.turn = 0
			for(var i=0;i<8;i++) {
				this.page.board[i] = []
				for(var j=0;j<8;j++) {
					this.page.board[i][j] = 0
				}
			}
		},
		newGame() {
			this.$confirm("Start a new game?").then((response) => {
				if(response) {
					this.socket.emit('leave_game', this.page.room)	
					this.page.connectedWithOther = false
					this.createBoard()
					window.location.reload()
				}
				else {
					return
				}
			});
		},
		joinGame() {
			this.socket.emit('join_game', this.page.socketIdToJoin, this.socket.id)	
		},
		copyClientId() {
			let copy = document.querySelector('#copyClientId')
			copy.setAttribute('type', 'text')
			copy.select()
			document.execCommand('copy')
			copy.setAttribute('type', 'hidden')
			window.getSelection().removeAllRanges()
		},
		gameOver(w) {
			this.page.gameWon = true
			this.page.winner = w
			this.$alert('Player '+this.getWinner()+" Win's The Game!", 'Game Over!')
			.then(() => {
				window.location.reload()
			})
			.catch((error) => {
				window.location.reload()
			})
		},
		getWinner() {
			return (this.page.winner == 1)
				? "Red"
				: "Yellow"
		},
		placeMove(x,y) {
			this.socket.emit('move_placed', this.page.room, x, y)
		},
		value(t) {
			return (t == 1)
				? 1
				: -1
		},
		valueBelow(x,y) {
			return(typeof this.page.board[x+1][y] !== undefined && this.page.board[x+1][y] !== 0)
				? true
				: false
		},
		checkHorizontalWin(n) {
			for(var i=0;i<8;i++) {
				for(var j=0;j<8;j++) {
					if(0 < j < 4) {
						if(this.page.board[i][j] == n && this.page.board[i][j+1] == n && this.page.board[i][j+2] == n && this.page.board[i][j+3] == n) {
							this.gameOver(n)
						}
					}
				}
			}
		},
		checkVerticalWin(m) {
			for(var i=0;i<8;i++) {
				for(var j=0;j<8;j++) {
					if(i >= 3) {
						if(this.page.board[i][j] == m && this.page.board[i-1][j] == m && this.page.board[i-2][j] == m && this.page.board[i-3][j] == m) {
							this.gameOver(m)
						}
					}
				}
			}
		},
		checkDiagonalWin() {
			this.checkBLTRdiagonals()
			this.checkTLBRdiagonals()
		},
		checkBLTRdiagonals() {
		  	for (var j = 0; j < 5; j++) {
				for (var i = 0; i < 5; i++) {
					var count = 0
					var space = this.page.board[i][j]
					if(space !== 0) {
						for (var step = 0; step < 4; step++) {
							if (space === this.page.board[i + step][j + step]) {
								count++
							} 
							else {
								break
							}
							if (count === 4) {
								this.gameOver(space)
							}
						}
					}
				}
		  	}
		},
		checkTLBRdiagonals() {
			for (var j = 3; j <= 7; j++) {
				for (var i = 0; i < 5; i++) {
					var count = 0
					var space = this.page.board[i][j]
					if(space !== 0) {
						for (var step = 0; step < 4; step++) {
							if (space === this.page.board[i + step][j - step]) {
							  	count++
							} 
							else {
							  	break
							}
							if (count === 4) {
								this.gameOver(space)
							}
						}
					}
				}
			}
		},
	},
	created() {
		this.socket = io("https://socket-server.visudo.me:3000/", { secure: true, reconnection: false, rejectUnauthorized: false })
		this.socket.on('new_game', (room, client) => {
			this.page.connectedWithOther = true
			this.page.room = room
			this.page.playerYellow = room
			this.page.playerRed = client
		})
		this.socket.on('move_placed_received', (x,y) => {
			this.$set(this.page.board[x], [y], this.value(this.page.turn))
			this.checkHorizontalWin(this.value(this.page.turn))
			this.checkVerticalWin(this.value(this.page.turn))
			this.checkDiagonalWin()
			this.page.turn = !this.page.turn
			this.$forceUpdate()
		})
		this.socket.on('player_left', (room) => {
			this.page.connectedWithOther = false
			window.location.reload()
		})
		this.createBoard()
	},
}

</script>

