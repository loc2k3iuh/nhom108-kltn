package iuh.fit.se.services.interfaces;

import java.io.IOException;
import org.springframework.web.multipart.MultipartFile;

public interface IS3Service {
  String uploadFile(MultipartFile file, String userName) throws IOException;

  String uploadPdfFile(byte[] pdfBytes, String fileName) throws IOException;

  void deleteFile(String file);
}
