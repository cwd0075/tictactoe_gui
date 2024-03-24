# tictactoe_gui
tic tac toe website  

GUI based on freeCodeCamp tutorial  
https://www.youtube.com/watch?v=P2TcQ3h0ipQ  

While tictactoe javascript logic is convert from python using codeconvert.ai  
Alphazero from Scratch by freeCodeCamp  
https://github.com/cwd0075/alphazero/blob/main/tictactoe_part1.py  

To run:  
just run tictactoe.html on a local web server  
I run on VS Code Live Server locally (see Note: Setup javascript development environment on Windows)   

### MCTS Folder:  
tic tac toe, human play againts MCTS AI   
MCTS code is from:  
Alphazero from Scratch by freeCodeCamp  
https://github.com/cwd0075/alphazero/blob/main/mcts_part2.py  

### MCTS_Debug Folder: 
debug print node info in console.log  

### AlphaMCTS_Onnx Folder:  
tic tac toe, human play against MCTS with AlphaZero ML network in Onnx format    
AlphaMCTS code is from:  
https://github.com/cwd0075/alphazero/blob/main/alphamcts_part4.py  
https://github.com/cwd0075/alphazero/blob/main/onnx_test.js   

code update comparing to MCTS:  
MCTS using Value Network (replace node simulate to get the value) and Policy Network, network is in Onnx format  
Node no longer expand one at a time but expand all at once and add parent action probability to the node, so no need to keep record of expanable moves  
Node value (last time calculated by node simulation, now deleted) is calculated based on value neural network if not at game terminal  
UCB formula updated to include node probability  
