package iuh.fit.se.services.impls;

import iuh.fit.se.services.interfaces.IS3Service;
import java.io.IOException;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetUrlRequest;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
@RequiredArgsConstructor
public class S3ServiceImpl implements IS3Service {

  @Value("${aws.s3.bucket.name}")

  String bucketName;

  final S3Client s3Client;

  @Override
  public String uploadFile(MultipartFile file, String userName) throws IOException {
    String folderName = "users/" + userName;
    String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
    String key = folderName + "/" + fileName;

    PutObjectRequest putObjectRequest =
        PutObjectRequest.builder()
            .bucket(bucketName)
            .key(key)
            .acl(ObjectCannedACL.PUBLIC_READ)
            .contentType(file.getContentType())
            .build();

    s3Client.putObject(putObjectRequest, RequestBody.fromBytes(file.getBytes()));

    return s3Client
        .utilities()
        .getUrl(GetUrlRequest.builder().bucket(bucketName).key(key).build())
        .toExternalForm();
  }
}
