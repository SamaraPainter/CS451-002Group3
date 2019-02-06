import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;
import java.net.UnknownHostException;

public class Client {
    PrintWriter out = null;
    BufferedReader in = null;
    Socket echoSocket = null;
    public static final int PORT_NUMBER = 8000;
    public static final String HOSTNAME = "localhost";//"ec2-18-222-180-244.us-east-2.compute.amazonaws.com";

    public static void main(String[] args) {
        String hostname = HOSTNAME;
        int portNum = PORT_NUMBER;
        if (args.length > 0)
            hostname = args[0];
        if (args.length > 1)
            try {
                portNum = Integer.parseInt(args[1]);
            } catch (NumberFormatException e) {
                System.out.println("Bad port number: " + args[1]);
                System.out.println("Using default: " + portNum);
            }
        Client client = new Client(hostname, portNum);
        client.playGame();
    }

    public Client(String host, int port) {
        try {
            String serverHostname = new String(host);

            System.out.println("Connecting to host " + serverHostname + " on port " + port + ".");
            try {
                echoSocket = new Socket(serverHostname, port);
                out = new PrintWriter(echoSocket.getOutputStream(), true);
                in = new BufferedReader(new InputStreamReader(echoSocket.getInputStream()));
            } catch (UnknownHostException e) {
                System.err.println("Unknown host: " + serverHostname);
                return;
            } catch (IOException e) {
                System.err.println("Unable to get streams from server");
                return;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private boolean bad() {
        return ((out == null) || (in == null) || (echoSocket == null));
    }


    void playGame() {
        if (bad())
            return;
        try {
            BufferedReader stdIn = new BufferedReader(new InputStreamReader(System.in));
            while (true) {
                String resp = in.readLine();
                if (resp == null) {
                	break;
                }
                Move m = Move.parse(resp);
                if (m.msg.equals("ping")) {
                    out.println(m.stringify());
                    continue;
                }
                if (m.msg.equals("PROMPT")) {
                    System.out.println("server: Your turn!");
                    String userInput = "";
                    System.out.print("Enter a move: ");
                    userInput = stdIn.readLine().trim();
                    if (userInput.equals("quit")) {
                    	break;
                    }
                    out.println(new Move(userInput).stringify());
                } else {
                    System.out.println("server: " + m.msg);
                }
            }
            stdIn.close();
            out.close();
            in.close();
            echoSocket.close();
        } catch (

        Exception e) {
            e.printStackTrace();
        }
    }
}
