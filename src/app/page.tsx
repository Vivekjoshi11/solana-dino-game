/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
// import React, { useEffect, useRef, useState } from "react";
// import { Connection, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
// import { Program, AnchorProvider, web3 } from "@project-serum/anchor";

// const programId = new PublicKey("YourDeployedProgramIDHere"); // Replace with your Solana Program ID

// const idl = {}; // Replace with your IDL JSON (from `target/idl/*.json`)

// const Home: React.FC = () => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [score, setScore] = useState(0);
//   const [gameEnded, setGameEnded] = useState(false);

//   // Function to initialize the game
//   const startGame = () => {
//     const canvas = canvasRef.current;
//     const context = canvas?.getContext("2d");

//     if (!canvas || !context) return;

//     const dinoX = 50;
//     const dinoY = canvas.height - 30;
//     let obstacles: { x: number; y: number }[] = [];
//     let interval: NodeJS.Timeout;

//     const runGame = () => {
//       context.clearRect(0, 0, canvas.width, canvas.height);

//       // Draw Dino
//       context.fillStyle = "green";
//       context.fillRect(dinoX, dinoY, 20, 20);

//       // Create Obstacles
//       if (Math.random() < 0.02) {
//         obstacles.push({ x: canvas.width, y: canvas.height - 30 });
//       }

//       // Move Obstacles
//       obstacles = obstacles.map((obs) => ({ x: obs.x - 5, y: obs.y }));
//       obstacles = obstacles.filter((obs) => obs.x > 0);

//       // Draw Obstacles
//       context.fillStyle = "red";
//       obstacles.forEach((obs) => {
//         context.fillRect(obs.x, obs.y, 20, 20);
//       });

//       // Collision Detection
//       const collided = obstacles.some(
//         (obs) => dinoX < obs.x + 20 && dinoX + 20 > obs.x && dinoY < obs.y + 20 && dinoY + 20 > obs.y
//       );
//       if (collided) {
//         clearInterval(interval);
//         setGameEnded(true);
//       }

//       // Increment Score
//       setScore((prev) => prev + 1);
//     };

//     interval = setInterval(runGame, 50);
//   };

//   // Submit score to Solana blockchain
//   const submitScore = async () => {
//     try {
//       const wallet = window.solana; // Assume Phantom Wallet is being used
//       if (!wallet) {
//         alert("Wallet not found! Please install Phantom Wallet.");
//         return;
//       }

//       const connection = new Connection(web3.clusterApiUrl("devnet"), "confirmed");
//       const provider = new AnchorProvider(connection, wallet, {});
//       const program = new Program(idl, programId, provider);

//       const [gameAccount] = web3.PublicKey.findProgramAddressSync(
//         [Buffer.from("dino_game"), wallet.publicKey.toBuffer()],
//         programId
//       );

//       await program.rpc.submitScore(new web3.BN(score), {
//         accounts: {
//           gameAccount,
//           player: wallet.publicKey,
//           systemProgram: SystemProgram.programId,
//         },
//       });

//       alert("Score submitted to the blockchain!");
//     } catch (error) {
//       console.error(error);
//       alert("Failed to submit score.");
//     }
//   };

//   return (
//     <div style={{ textAlign: "center" }}>
//       <h1>Dino Game on Solana</h1>
//       <canvas ref={canvasRef} width={800} height={400} style={{ border: "1px solid black" }} />
//       {!gameEnded ? (
//         <button onClick={startGame}>Start Game</button>
//       ) : (
//         <button onClick={submitScore}>Submit Score</button>
//       )}
//       <p>Score: {score}</p>
//     </div>
//   );
// };

// export default Home;
'use client';

import React, { useEffect, useRef, useState } from "react";
import { Connection, PublicKey, SystemProgram } from "@solana/web3.js";
import { Program, AnchorProvider } from "@project-serum/anchor";
import BN from "bn.js";
// import idl from "./idl/solana_dino_game.json"; // Adjust based on your file structure
// Import your program's IDL
import idlRaw from "./idl/solana_dino_game.json";
import { Idl } from "@project-serum/anchor";

const idl: Idl = idlRaw as unknown as Idl;


const programId = new PublicKey("GoD5ZDT4RLUDVn1ooV7oVHwNee4hUjTYwAfAbs5k1ahK"); // Replace with your Solana Program ID

const Home: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameEnded, setGameEnded] = useState(false);

  const startGame = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    let dinoX = 50;
    let dinoY = canvas.height - 30;
    let obstacles: { x: number; y: number }[] = [];
    let interval: NodeJS.Timeout;

    const runGame = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "green";
      context.fillRect(dinoX, dinoY, 20, 20);

      if (Math.random() < 0.02) {
        obstacles.push({ x: canvas.width, y: canvas.height - 30 });
      }
      obstacles = obstacles.map((obs) => ({ x: obs.x - 5, y: obs.y }));
      obstacles = obstacles.filter((obs) => obs.x > 0);
      context.fillStyle = "red";
      obstacles.forEach((obs) => {
        context.fillRect(obs.x, obs.y, 20, 20);
      });

      const collided = obstacles.some(
        (obs) => dinoX < obs.x + 20 && dinoX + 20 > obs.x && dinoY < obs.y + 20 && dinoY + 20 > obs.y
      );
      if (collided) {
        clearInterval(interval);
        setGameEnded(true);
      }

      setScore((prev) => prev + 1);
    };

    interval = setInterval(runGame, 50);
  };

  // const submitScore = async () => {
  //   try {
  //     const wallet = window.solana;
  //     if (!wallet) {
  //       alert("Wallet not found! Please install Phantom Wallet.");
  //       return;
  //     }

  //     const connection = new Connection("https://api.devnet.solana.com", "confirmed");
  //     const provider = new AnchorProvider(connection, wallet, {});
  //     const program = new Program(idl, programId, provider);

  //     const [gameAccount] = PublicKey.findProgramAddressSync(
  //       [Buffer.from("dino_game"), wallet.publicKey.toBuffer()],
  //       programId
  //     );

  //     await program.rpc.submitScore(new BN(score), {
  //       accounts: {
  //         gameAccount,
  //         player: wallet.publicKey,
  //         systemProgram: SystemProgram.programId,
  //       },
  //     });

  //     alert("Score submitted to the blockchain!");
  //   } catch (error) {
  //     console.error(error);
  //     alert("Failed to submit score.");
  //   }
  // };

  const submitScore = async () => {
    try {
      const wallet = window.solana as any; // Explicitly tell TypeScript that window.solana exists
  
      if (!wallet) {
        alert("Wallet not found! Please install Phantom Wallet.");
        return;
      }
  
      await wallet.connect(); // Ensure the user connects their wallet
  
      const connection = new Connection("https://api.devnet.solana.com", "confirmed");
      const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions());
      const program = new Program(idl as Idl, programId, provider); // Ensure IDL is properly typed
  
      const [gameAccount] = PublicKey.findProgramAddressSync(
        [Buffer.from("dino_game"), wallet.publicKey.toBuffer()],
        programId
      );
  
      await program.rpc.submitScore(new BN(score), {
        accounts: {
          gameAccount,
          player: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
      });
  
      alert("Score submitted to the blockchain!");
    } catch (error) {
      console.error("Error submitting score:", error);
      alert("Failed to submit score.");
    }
  };
  
  return (
    <div style={{ textAlign: "center" }}>
      <h1>Dino Game on Solana</h1>
      <canvas ref={canvasRef} width={800} height={400} style={{ border: "1px solid black" }} />
      {!gameEnded ? (
        <button onClick={startGame}>Start Game</button>
      ) : (
        <button onClick={submitScore}>Submit Score</button>
      )}
      <p>Score: {score}</p>
    </div>
  );
};

export default Home;