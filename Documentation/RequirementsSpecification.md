# Requirements Specification for CS451-002 Group 3 Project
*Revision 0.9*


| Group Members | Korede Aderele <br> Natie Kolbe <br> Samara Painter <br> Alex Veltchev |
| --- | --- | --- |
| **Faculty Advisor** | **Dr. Filippos Vokolos, Ph. D** |

## Revision History

| **Name** | **Date** | **Reason for Change** | **Revision** |
| --- | --- | --- | --- |
| Samara Painter | 1/16/2019 | Initial Document Creation - Empty Sections with Section Headers | 0.9 |

## Table of Contents

1. [Introduction](#introduction)
   1. [Purpose of Docuement](#purpose-of-document)
   2. [Scope of Document](#scope-of-document)
   3. [Overview of Document](#overview-of-document)
2. [Description](#description)
   1. [Product Perspective](#product-perspective)
      1. [Server Role](#server-role)
      2. [Client Role](#client-role) 
   2. [Product Functions](#product-functions)
      1. [Client Functionality](#client-functionality)
      2. [Server Functionality](#server-functionality)
   3. [User Description](#user-description)
   4. [Assumptions and Dependencies](#assumptions-and-dependencies)
      1. [Externally Hosted Server](#externally-hosted-server)
   5. [Requirements Apportioning](#requirements-apportioning)
3. [Functional Requirements](#functional-requirements)
4. [Non-Functional Requirements](#non-functional-requirements)
5. [User Interface](#user-interface)
   1. [Connecting Screen](#connecting-screen)
   2. [Game Options Screen](#game-options-screen)
   3. [Checkers Board Screen](#checkers-board-screen)
      1. [Waiting for Opponent Splash Screen](#waiting-for-opponent-splash-screen)
      2. [Game Result Splash Screen](#game-result-splash-screen)  
6. [Use Cases](#use-cases)
7. [Glossary](#glossary)   

## 1. Introduction
### 1.1 Purpose of Document

This document will provide the requirements specifications for the CS451-002 Group 3 Project. 
It will also serve as a reference for the developers to design, implement, and test the project
for both completeness and correctness.

### 1.2 Scope of Document

This document will specify in detail all functions the project must perform to be considered both complete and correct. 
These specifications will be detailed enough for developers to translate into code with no ambiguity.

### 1.3 Overview of Document

This document will specify the functional, non-functional, and user interface requirements for the CS451-002
Group 3 Project. It will also specify desired use cases and UI mock-ups. The backend and frontend of the project
will run separately, and will be referred to as **server** and **client**, respectively. The requirements will
be provided for both the server backend and client frontend. This document will also contain mock-ups of the graphical
user interface that will be displayed by the client frontend.

## 2. Description

### 2.1 Product Perspective

The CS451-002 Group 3 Project is an environment that allows two remote users to play a game of checkers
against each other, in real time. The gameplay rules enforced by the environment can be found [here](http://www.usacheckers.com).

The project is intended to be run via three separate computers: a server, and two clients. 

#### 2.1.1 Server Role

The server will primarily facilitate the connection between two clients connected to the server, and will not be directly interacted
with by the users. Gameplay moves made on one client will be sent to the server, which will forward them to the other client. The
server will also start and end games between two clients connected to the server.

#### 2.1.2 Client Role

The client will connect to the server, and will provide a graphical user interface (GUI) to the users with which to play a game of
checkers. The GUI will represent an interactible checkers board and checkers pieces. When it is a user's turn, they will utilize the GUI
to make a legal checkers move that will be sent to the other user. Each client will update its own GUI when directed to by the server
that reflects the last move that was made.

### 2.2 Product Functions

#### 2.2.1 Server Functionality

The server will have the following functionality:

+ Ability to host one game over the Wi-Fi network between two clients
+ Ability to be connected to by two clients at a time
+ Ability to start a game between two connected clients, including initializing the game state
+ Ability to receive moves made by a connected client
+ Ability to send moves made by one client to the other connected client
+ Ability to end a game between two connected clients, including sending the end game state
+ Ability to disconnect clients
+ Ability to start a new game between two connected clients once a game has ended

#### 2.2.2 Client Functionality

The client will have the following functionality:

+ Ability to connect to the server
+ Ability to display a graphical user interface (GUI) representing a checkers board
+ Allows the user to select a legal checkers move
+ Ability to send a user's selected move to the server
+ Ability to receive a user's selected move from the server
+ Ability to refresh the GUI display to reflect a move received from the server

### 2.3 User Description

The ideal user for the CS451-002 Group 3 Project would be two friends with a general
familiarity of computers who desire to play a game of checkers in two separate locations.

### 2.4 Assumptions and Dependencies

#### 2.4.1 Externally Hosted Server

This project will be dependent on an external host on which to run the server. The specific external
host that will be utilized will be determined in the design phase of the project. If the external host
goes down or otherwise ceases to function, the project will not be able to be run. In this case,
the project timeline will be modified to account for a redesign that includes a different external
host and a migration of the server to the new external host.

### 2.5 Requirements Apportioning

| Priority Level | Description |
| --- | --- |
| **1** | **Priority 1** requirements are essential to the project and must be in the final build. These requirements must be tested and verified to ensure proper functionality. |
| **2** | **Priority 2** requirements are not required for the final build, but will be included if there is sufficient time. The project will be designed to easily incorporate these requirements at a later time, but will also function without them present. |
| **3** | **Priority 3** requirements are not required for the final build and will not be considered in the design of the project. These requirements will reflect the ideal functionality of the project given enough time and resources. |

## 3. Functional Requirements

## 4. Non-Functional Requirements

## 5. User Interface

![A Walkthrough of the Client-Side GUI Screens](GUIWalkthrough.png)

**Figure 1.** *The flowchart for navigating the GUI on the client.*

The client will provide a graphical user interface (GUI) to the user. *Figure 1* shows the flow in navigating the different screens
displayed by the GUI. The requirements for each screen are outlined below.

### 5.1 Connecting Screen

+ **R5.1.1**  The Connecting Screen is the first screen displayed to the user upon starting the client application.
+ **R5.1.2**  The Connecting Screen displays the current connection status as "Connecting", "Connected", or "Unable to Connect."
  + **R5.1.2.1** If the connection status is "Unable to Connect," a reason is displayed as "Server Not Found" or "Game in Progress."
  + **R5.1.2.2** If the connection status is "Unable to Connect," two buttons are displayed:
    + **R5.1.2.2.1** A "Try Again" button, when clicked, attempts to connect to the server again.
    + **R5.1.2.2.2** A "Quit" button, when clicked, closes the client application.
  + **R5.1.2.3** If the connection status is "Connected," the connecting screen remains displayed for an additional 3 seconds to allow the user enough time to read the status.
    + **R5.1.2.3.1** After the 3 second pause of the connection screen with a "Connected" status, the GUI will display the Game Options Screen.

### 5.2 Game Options Screen

+ **R5.2.1** The Game Options Screen contains a text input box with the prompt "Nickname". 
  + **R5.2.1.1** The input of the text input box is limited to uppercase letters, lowercase letters, and spaces.
    + **R5.2.1.1.1** If an invalid character is entered by the user, an error message will display "Invalid nickname entered. Must contain only letters and spaces."
    + **R5.2.1.1.2** If an invalid character is present in the text input box, the "Start Game" button (R5.2.2) will not be clickable.
  + **R5.2.1.2** The text input box is limited to 32 characters. 
+ **R5.2.2** The Game Options Screen contains a "Start Game" button, when clicked, the GUI displays the Checkers Board Screen.

### 5.3 Checkers Board Screen

+ **R5.3.1** The Checkers Board Screen contains an 8x8 board of square tiles in alternating colors.
  + **R5.3.1.1** The alternating colors are neither red nor black.
+ **R5.3.2** The Checkers Board Screen displays no more than 12 red circular game pieces and 12 black circular game pieces.
  + **R5.3.2.1** When it is the user's turn, the user's pieces become clickable.
    + **R5.3.2.1.1** When a piece is clicked by the user, all of the tiles that piece can legally move to flash yellow and become clickable.
      + **R5.3.2.1.1.1** The yellow flashing is defined as a fade-to-yellow and fade-from-yellow cycle which takes approximately 3 seconds.
      + **R5.2.3.1.1.2** The yellow flashing is continuously looped until a move is made or the piece is deselected (R5.3.2.1.3).
      + **R5.2.3.1.1.3** If the clicked piece has no available legal moves, a message "No moves available for this piece" displays.
    + **R5.3.2.1.2** When a flashing tile is clicked, the clicked piece is moved to that tile.
      + **R5.3.2.1.2.1** If any opponent pieces were jumped in the move, they are removed from the board and noted in the "Pieces Captured" box.
      + **R5.3.2.2.1.2** After the user has selected a move, the user's pieces are no longer clickable.
      + **R5.3.2.2.1.3** After the user has selected a move, the GUI displays a splash screen after 3 seconds:
        + **R5.3.2.2.1.3.1** If the move caused an end game state, the Game Result Splash Screen is displayed.
        + **R5.3.2.2.1.3.2** If the move did not cause an end game state, the Waiting for Opponent Splash Screen is displayed.
    + **R5.3.2.1.3** When a piece is clicked a second time by the user, the piece is deselected.
+ **R5.3.3** The Checkers Board Screen contains a "Pieces Captured" box that contains a running total of the number of opponent pieces the user has captured.
  + **R5.3.3.1** The displayed running total must not be below 0 or above 12.
+ **R5.3.4** The Checkers Board Screen contains a "Forfeit" button, when clicked, the GUI displays the Game Result Splash Screen with the "Forfeit" status. 

#### 5.3.1 Waiting for Opponent Splash Screen

+ **R5.3.1.1** The Waiting for Opponent Splash Screen displays as an overlay on top of the Checkers Board Screen.
  + **R5.3.1.1.1** The splash screen is displayed at 50% opacity.
+ **R5.3.1.2** The Waiting for Opponent Splash Screen displays the message "Waiting for Opponent."
+ **R5.3.1.3** The Waiting for Opponent Splash Screen is automatically removed at the start of the user's next turn or when the Game Result Splash Screen is displayed.

#### 5.3.2 Game Result Splash Screen

+ **R5.3.2.1** The Game Result Splash Screen displays as an overlay on top of the Checkers Board Screen.
  + **R5.3.2.1.1** The splash screen is displayed at 50% opacity.
+ **R5.3.2.2** The Game Result Splash Screen displays the status of the game as "Winner," "Loser," "Forfeit," or "Draw."
+ **R5.3.2.3** The Game Result Splash Screen contains a "Quit" button, when clicked, exits the client application.

## 6. Use Cases

## 7. Glossary