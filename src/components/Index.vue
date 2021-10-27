<template>
	<div class="bg-gray-400">
		<div>
			<div class="ml-auto mr-auto pt-10 grid grid-rows-8 row-span-8 ml-4 w-3/5">
				<div class="flex flex-col ml-auto mr-auto sm:flex-row">
					<div class="mt-8 mr-4">
						<button class="bg-gray-200 hover:bg-gray-100 text-blue-900 font-semibold py-2 px-4 border border-blue-900 rounded shadow" @click="newGame()">
							New Game
						</button>
					</div>
					<div class="border-2 rounded-lg h-20 w-60 mt-2 mb-5 mx-auto text-center bg-blue-900 border-yellow-300">
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
								<div v-if="!this.page.connectedWithOther" class="text-gray-100">
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
				<div v-if="this.socket.connected && !this.page.connectedWithOther" class="mb-2 mx-auto">
					<div class="flex flex-col sm:flex-row items-center">
						<div class="mb-4 mx-auto font-semibold text-center bg-gray-200 py-2 px-3 text-blue-900 border border-blue-900 rounded">
							ClientID: {{clientId}}
						</div>
						<v-popover
							offset="12"
							placement="right"
  							:disabled="!isEnabled"
						>
						<input type="hidden" id="copyClientId" :value="clientId">
						<button class="w-24 h-6 ml-2 border rounded border-blue-900 bg-blue-900 text-white float-right text-md" 
							@click="copyClientId()">
							Copy
						</button>
						<template slot="popover">
							<div class="h-6 bg-gray-200 text-blue-900 border border-blue-900 rounded shadow font-bold">
								Copied!
							</div>
						</template>
						</v-popover>
					</div>
					<div class="flex flex-col sm:flex-row">
						<input class="w-64 mx-auto bg-gray-200 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border border-blue-900 rounded" v-model="page.socketIdToJoin" placeholder="Enter ClientID to join"></input>
						<div class="w-32 ml-4 mx-auto bg-gray-200 hover:bg-gray-100 text-blue-900 py-2 px-4 border border-blue-900 rounded shadow">
							<button @click="joinGame()" class="font-semibold">
								Join Game
							</button>
						</div>
					</div>
				</div>
				<div v-if="this.page.connectedWithOther">
					<div class="w-5/6 ml-auto mr-auto mb-5 font-semibold bg-gray-200 text-blue-900 border border-blue-900 rounded shadow sm:w-1/2 px-2 py-3 text-xs sm:text-sm">
						You are connected with another Player.
					</div>
					<div class="w-5/6 ml-auto mr-auto mb-5 font-semibold bg-gray-200 text-blue-900 border border-blue-900 rounded shadow sm:w-1/2 px-2 py-3 text-xs sm:text-sm">
						{{turnCompute}}
					</div>
					<div>
						{{page.timeLeft}}				
					</div>
				</div>
				<div class="container border-2 rounded-lg border-yellow-300 bg-blue-900 w-xl max-w-2xl m-auto mb-10">
					<div class="m-auto max-w-xl max-h-4 mb-4 mt-4 bg-blue-900 sm:max-h-8 md:max-h-12 lg:max-h-16" v-for="(item, index) in this.page.board">
						<div class="grid grid-cols-8">
							<div v-for="(i, nested_index) in item" class="mx-auto">
								<div v-if="i == 1">
									<div class="border-2 rounded h-4 w-4 border-yellow-300 bg-red-700 cursor-not-allowed md:rounded-lg sm:h-8 sm:w-8 md:h-12 md:w-12 lg:w-16 lg:h-16"></div>
								</div>
								<div v-else-if="i == -1">
									<div class="border-2 rounded h-4 w-4 border-yellow-300 bg-yellow-300 cursor-not-allowed md:rounded-lg sm:h-8 sm:w-8 md:w-12 md:h-12 lg:w-16 lg:h-16"></div>
								</div>
								<div v-else>
									<div v-if="index == 7 || index !== 0 && valueBelow(index, nested_index) || index == 0 && valueBelow(index, nested_index)">
										<div v-if="gameOverCompute == false">
											<div v-if="page.turn == 0 && page.playerYellow == socket.id">
												<button @click="placeMove(index, nested_index)">
													<div class="border-2 rounded h-4 w-4 border-yellow-300 bg-gray-400 md:rounded-lg sm:h-8 sm:w-8 md:w-12 md:h-12 lg:w-16 lg:h-16"></div>
												</button>
											</div>
											<div v-else-if="page.turn == 1 && page.playerRed == socket.id">
												<button @click="placeMove(index, nested_index)">
													<div class="border-2 rounded h-4 w-4 border-yellow-300 bg-gray-400 md:rounded-lg sm:h-8 sm:w-8 md:w-12 md:h-12 lg:w-16 lg:h-16"></div>
												</button>
											</div>
											<div v-else>
												<div class="border-2 rounded h-4 w-4 border-yellow-300 bg-gray-400 cursor-not-allowed md:rounded-lg sm:h-8 sm:w-8 md:w-12 md:h-12 lg:w-16 lg:h-16"></div>
											</div>
										</div>
										<div v-else>
											<div class="border-2 rounded h-4 w-4 border-yellow-300 bg-gray-400 cursor-not-allowed md:rounded-lg sm:h-8 sm:w-8 md:w-12 md:h-12 lg:w-16 lg:h-16"></div>
										</div>
									</div>
									<div v-else>
										<div class="border-2 rounded h-4 w-4 border-yellow-300 bg-gray-400 cursor-not-allowed md:rounded-lg sm:h-8 sm:w-8 md:h-12 md:w-12 lg:w-16 lg:h-16"></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="border border-2 border-blue-900 rounded-lg ml-auto mr-auto w-5/6 mb-12 py-2 px-3">
					<h1 class="text-blue-900 font-bold text-lg sm:text-2xl mb-4">How to Play:</h1>
					<ul class="list-disc list-inside text-left ml-6 text-blue-900 font-semibold mx-auto text-sm sm:text-lg">
						<li>Copy your client ID above and send it to one of your friends.</li>
						<li>Have one of your friends send you theirs and connect to their session.</li>
						<li>Play the game until there is a winner or a draw. Good luck!</li>
					</ul>
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
			isEnabled: true,
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
				timeLeft: null,
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
			if(w == 0) {
				this.$alert("It's a Draw!", 'Game Over!')
				.then(() => {
					window.location.reload()
				})
				.catch((error) => {
					window.location.reload()
				})
			}
			else {
				this.$alert('Player '+this.getWinner()+" Win's The Game!", 'Game Over!')
				.then(() => {
					window.location.reload()
				})
				.catch((error) => {
					window.location.reload()
				})
			}
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
			return(this.page.board[x+1][y] !== undefined && this.page.board[x+1][y] !== 0)
				? true
				: false
		},
		checkDraw() {
			var containsEmptySpace = false
			for(var i=0;i<8;i++) {
				for(var j=0;j<8;j++) {
					if(this.page.board[i][j] == 0) {
						containsEmptySpace = true
					}
				}
			}
			if(!containsEmptySpace) {
				this.gameOver(0)
			}
		},
		checkHorizontalWin(n) {
			for(var i=0;i<8;i++) {
				for(var j=0;j<8;j++) {
					if(0 <= j && j < 4) {
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
		updateTime() {
			if(this.page.timeLeft == null) {
				return
			}
			else {
				if(this.page.timeLeft == 0) {
					this.page.timeLeft = null
					this.timeOut(this.page.turn)
				}
				else {
					this.page.timeLeft--
				}
			}
		},
		timeOut() {
			this.socket.emit('error_timed_out', this.page.turn, this.page.room)
		},
		timeOutPlayer(i) {
			return (i == 1)
				? "Player Red Timed Out"
				: "Player Yellow Timed Out"
		},
	},
	created() {
		setInterval(() => {this.updateTime()}, 1000)
		this.socket = io("https://socket-server.plank-and-timber.com/", { secure: true, reconnection: false, rejectUnauthorized: false })
		this.socket.on('new_game', (room, client) => {
			this.page.connectedWithOther = true
			this.page.room = room
			this.page.playerYellow = room
			this.page.playerRed = client
			this.page.timeLeft = 30
		})
		this.socket.on('move_placed_received', (x,y) => {
			this.$set(this.page.board[x], [y], this.value(this.page.turn))
			this.checkHorizontalWin(this.value(this.page.turn))
			this.checkVerticalWin(this.value(this.page.turn))
			this.checkDiagonalWin()
			this.checkDraw()
			this.page.timeLeft = 30
			this.page.turn = !this.page.turn
			this.$forceUpdate()
		})
		this.socket.on('player_left', (room) => {
			this.page.connectedWithOther = false
			window.location.reload()
		})
		this.socket.on('error_same_room', (room) => {
			this.$alert('You cannot join your own room!', 'Error!')
			.then(() => {
				return
			})
			.catch((error) => {
				return
			})
		})
		this.socket.on('error_no_room', (room) => {
			this.$alert('A room with that ID does not exist!', 'Error!')
			.then(() => {
				return
			})
			.catch((error) => {
				return
			})
		})
		this.socket.on('error_room_full', (room) => {
			this.$alert('This room is full!', 'Error!')
			.then(() => {
				return
			})
			.catch((error) => {
				return
			})
		})
		this.socket.on('error_player_timed_out', (player) => {
			this.$alert(this.timeOutPlayer(player), 'Time Out!')
			.then(() => {
				window.location.reload()
			})
			.catch((error) => {
				window.location.reload()
			})
		})
		this.createBoard()
	},
}

</script>

