import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.OutputStream;
import java.io.Serializable;
import java.net.Socket;
import java.util.Base64;

public class Move implements Serializable {
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	String msg;

    Move(String m) {
        msg = m;
    }
    
    public static Move parse(String s) throws IOException, ClassNotFoundException {
        byte[] data = Base64.getDecoder().decode(s);
        ObjectInputStream ois = new ObjectInputStream(new ByteArrayInputStream(data));
        Move m = (Move)ois.readObject();
        ois.close();
        return m;
    }

    public String stringify() throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ObjectOutputStream oos = new ObjectOutputStream(baos);
        oos.writeObject(this);
        oos.close();
        return Base64.getEncoder().encodeToString(baos.toByteArray());
    }

    public void send(Socket soc) throws IOException {
        OutputStream out = soc.getOutputStream();
        String s = this.stringify() + '\n';
        out.write(s.getBytes());
    }

    public static Move receive(Socket soc) throws IOException, ClassNotFoundException {
        BufferedReader br = new BufferedReader(new InputStreamReader(soc.getInputStream()));
        String s = br.readLine();
        return parse(s);
    }
    
}