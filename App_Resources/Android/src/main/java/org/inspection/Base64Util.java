package main.java.org.inspection;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

public class Base64Util {
    public static void getBytFromBase64(String base64,String path) throws IOException {
        byte[] decode = Base64.getDecoder().decode(base64.getBytes(StandardCharsets.UTF_8));
        FileOutputStream fos=new FileOutputStream(new File(path));
        fos.write(decode);
        fos.close();
    }
}
