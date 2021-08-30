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
										{{winnerCompute}}
									</div>
								</div>
								<div v-else>
									<div class="text-yellow-300 font-black">
										{{winnerCompute}}
									</div>
								</div>
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
				<div class="container border-2 rounded-lg border-yellow-300 bg-blue-900 max-w-2xl mr-auto ml-auto mb-20">
					<div class="ml-auto mr-auto max-w-xl max-h-16 mb-4 mt-4 bg-blue-900" v-for="(item, index) in this.page.board">
						<div class="grid grid-cols-8">
							<div v-for="(i, nested_index) in item">
								<div v-if="i == 1">
									<div class="border-2 rounded-lg h-16 w-16 border-yellow-300 bg-red-700 cursor-not-allowed"></div>
								</div>
								<div v-else-if="i == -1">
									<div class="border-2 rounded-lg h-16 w-16 border-yellow-300 bg-yellow-300 cursor-not-allowed"></div>
								</div>
								<div v-else>
									<div v-if="index == 7 || index !== 0 && valueBelow(index, nested_index) || index == 0 && valueBelow(index, nested_index)">
										<div v-if="gameOverCompute == false">
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
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "ConnectFour",
	data() {
		return {
			page: {
				board: [],
				turn: null,
				gameWon: null,
				winner: null,
			}
		}
	},
	computed: {
		turn() {
			return (this.page.turn == 1)
				? "It's Red's Turn"
				: "It's Yellow's Turn"
		},
		gameOverCompute() {
			return (this.page.gameWon == true)
				? true
				: false
		},
		winnerCompute() {
			return (this.page.winner == 1)
				? "Red won!"
				: "Yellow won!"
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
					this.createBoard()
					this.$forceUpdate()
				}
				else {
					return
				}
			});
		},
		gameOver(w) {
			this.page.gameWon = true
			this.page.winner = w
			if(w == 1) {
				this.$confirm("Would you like to play again?", "Red Win's The Game!", 'success')
                .then((result) => {
                    if (result) {
						this.createBoard()
                    }
					this.$forceUpdate()
                })
				.catch((error) => {
					this.$forceUpdate()
				})
			}
			else {
				this.$confirm("Would you like to play again?", "Yellow Win's The Game!", 'success')
                .then((result) => {
                    if (result) {
						this.createBoard()
                    }
					this.$forceUpdate()
                })
				.catch((error) => {
					this.$forceUpdate()
				})
			}
		},
		placeMove(x,y) {
			this.$set(this.page.board[x], [y], this.value(this.page.turn))
			this.checkHorizontalWin(this.value(this.page.turn))
			this.checkVerticalWin(this.value(this.page.turn))
			this.checkDiagonalWin()
			this.page.turn = !this.page.turn
			this.$forceUpdate()
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
					var currentCount = 0
					var currentToken = this.page.board[i][j]
					if(currentToken !== 0) {
						for (var step = 0; step < 4; step++) {
							if (currentToken === this.page.board[i + step][j + step]) {
								currentCount++
							} 
							else {
								break
							}
							if (currentCount === 4) {
								this.gameOver(currentToken)
							}
						}
					}
				}
		  	}
		},
		checkTLBRdiagonals() {
			for (var j = 3; j <= 7; j++) {
				for (var i = 0; i < 5; i++) {
					var currentCount = 0
					var currentToken = this.page.board[i][j]
					if(currentToken !== 0) {
						for (var step = 0; step < 4; step++) {
							if (currentToken === this.page.board[i + step][j - step]) {
							  	currentCount++
							} 
							else {
							  	break
							}
							if (currentCount === 4) {
								this.gameOver(currentToken)
							}
						}
					}
				}
			}
		},
	},
	created() {
		this.createBoard()
	},
}

</script>

