import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;

public class Server extends Thread {
    public static final int PORT_NUMBER = 8000;
    private static int gameCount = 0;
    protected Socket[] player = new Socket[2];

    private Server(Socket socket1, Socket socket2) {
        this.player[0] = socket1;
        this.player[1] = socket2;
        start();
    }
    @Override
    public void run() {
        gameCount = 1;
        try {
            int indx = 0;
            while (true) {
                new Move("PROMPT").send(player[indx]);
                Move move = null;
                try {
                    move = Move.receive(player[indx]);
                } catch (Exception e) {
                    System.out.println("Client hung up!");
                    new Move("Your opponent hung up...").send(player[next(indx)]);
                    break;
                }
                System.out.println("Request from player " + (indx + 1) + " " + move.msg);
                if (move.msg.equals("quit")) {
                    new Move("You resigned").send(player[indx]);
                    new Move("Your opponent resigned").send(player[next(indx)]);
                    break;
                }
                indx = next(indx);
                move.send(player[indx]);
            }

        } catch (IOException ex) {
            System.out.println("Unable to access streams from client");
        } finally {
            try {
                this.player[0].close();
                this.player[1].close();
            } catch (IOException ex) {
                ex.printStackTrace();
            }
        }
        gameCount = 0;
    }

    private static int next(int n) {
        return (n + 1) % 2;
    }


    private static boolean testConn(Socket soc) {
        try {
            new Move("ping").send(soc);
            Move resp = Move.receive(soc);
            if (resp.msg.equals("ping"))
                return true;
        } catch (IOException | ClassNotFoundException e) {
            return false;
        }
        return false;
    }

    public static void main(String[] args) {
        int portNum = PORT_NUMBER;
        if (args.length > 0)
            try {
                portNum = Integer.parseInt(args[0]);
            } catch (NumberFormatException e) {
                System.out.println("Bad port number: " + args[0]);
                System.out.println("Using default: " + portNum);
            }
        System.out.println("\nGame server ready. Listening on port " + portNum + "\n");
        ServerSocket server = null;
        try {
            Socket[] players = new Socket[2];
            int indx = 0;
            server = new ServerSocket(portNum);
            while (true) {
                players[indx] = server.accept();
                System.out.println("New client connected from " + players[indx].getInetAddress().getHostAddress());
                if (gameCount == 0) {
                	new Move("You requested to play. Looking for an opponent.").send(players[indx]);
                } else {
                	new Move("A game is already in progress").send(players[indx]);
                	players[indx].close();
                	continue;
                }
                indx = next(indx);
                if (indx == 1)
                    continue;
                if (!testConn(players[0])) {
                    System.out.println("Client has left...");
                    players[0].close();
                    players[0] = players[1];
                    indx = 1;
                    continue;
                }
                new Move("Opponent found!").send(players[0]);
                new Move("Opponent found!").send(players[1]);
                new Server(players[0], players[1]); // new game on a new thread!
            }
        } catch (IOException ex) {
            System.out.println("Unable to start server.");
        } finally {
            try {
                if (server != null)
                    server.close();
            } catch (IOException ex) {
                ex.printStackTrace();
            }
        }
    }
}
