-- Add pdf_url column to orders table
ALTER TABLE orders
ADD COLUMN pdf_url VARCHAR(500) NULL AFTER voucher_code;

-- Add comment for the column
ALTER TABLE orders
MODIFY COLUMN pdf_url VARCHAR(500) NULL COMMENT 'URL của file PDF hóa đơn trên S3';

