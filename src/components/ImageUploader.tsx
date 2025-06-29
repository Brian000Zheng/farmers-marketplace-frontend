import React, { useState, useRef, ChangeEvent } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Card,
  CardMedia,
  CardActions,
  Tooltip,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  StarBorder as StarBorderIcon,
  Star as StarIcon,
  CloudUpload as CloudUploadIcon
} from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';
import { ProductImage } from '../types';

interface ImageUploaderProps {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ images, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);

    const newImages: ProductImage[] = [];
    const promises: Promise<ProductImage>[] = [];

    // 处理每个选择的文件
    Array.from(files).forEach((file) => {
      const promise = new Promise<ProductImage>((resolve, reject) => {
        // 验证文件类型
        if (!file.type.startsWith('image/')) {
          reject(new Error(`${file.name} 不是有效的图片文件`));
          return;
        }

        // 验证文件大小 (限制为5MB)
        if (file.size > 5 * 1024 * 1024) {
          reject(new Error(`${file.name} 太大了，请上传小于5MB的图片`));
          return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target && event.target.result) {
            const newImage: ProductImage = {
              id: uuidv4(),
              url: event.target.result as string,
              isMain: images.length === 0 && newImages.length === 0, // 如果是第一张图片，则设为主图
              file: file
            };
            resolve(newImage);
          } else {
            reject(new Error(`无法读取文件 ${file.name}`));
          }
        };
        reader.onerror = () => {
          reject(new Error(`读取文件 ${file.name} 时出错`));
        };
        reader.readAsDataURL(file);
      });

      promises.push(promise);
    });

    // 等待所有文件处理完成
    Promise.all(promises)
      .then((processedImages) => {
        const updatedImages = [...images, ...processedImages];
        onChange(updatedImages);
        setUploading(false);
        // 清除文件输入，以便可以再次选择相同的文件
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      })
      .catch((err) => {
        setError(err.message);
        setUploading(false);
        // 清除文件输入
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      });
  };

  const handleDeleteImage = (id: string) => {
    const updatedImages = images.filter(img => img.id !== id);
    
    // 如果删除的是主图，则将第一张图片设为主图
    if (images.find(img => img.id === id)?.isMain && updatedImages.length > 0) {
      updatedImages[0].isMain = true;
    }
    
    onChange(updatedImages);
  };

  const handleSetMainImage = (id: string) => {
    const updatedImages = images.map(img => ({
      ...img,
      isMain: img.id === id
    }));
    
    onChange(updatedImages);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1">Product Images <span style={{ color: 'red' }}>*</span></Typography>
        <Button 
          startIcon={<CloudUploadIcon />} 
          onClick={handleAddImageClick}
          variant="outlined"
          size="small"
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Upload Images'}
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          multiple
          style={{ display: 'none' }}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {uploading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <CircularProgress size={24} sx={{ mr: 1 }} />
          <Typography>Processing images...</Typography>
        </Box>
      )}

      {images.length === 0 ? (
        <Box 
          sx={{ 
            border: '2px dashed #ccc', 
            borderRadius: 2, 
            p: 3, 
            textAlign: 'center',
            backgroundColor: '#f9f9f9'
          }}
        >
          <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
          <Typography color="text.secondary">
            Please upload at least one product image
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            Supports JPG, PNG, GIF formats. Maximum file size: 5MB per image
          </Typography>
          <Button 
            startIcon={<CloudUploadIcon />} 
            onClick={handleAddImageClick}
            variant="contained"
            sx={{ mt: 2 }}
            disabled={uploading}
          >
            Choose Images
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', margin: -1 }}>
          {images.map((image) => (
            <Box key={image.id} sx={{ width: { xs: '50%', sm: '33.33%', md: '25%' }, padding: 1 }}>
              <Card>
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={image.url}
                    alt="产品图片"
                  />
                  {image.isMain && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        backgroundColor: 'primary.main',
                        color: 'white',
                        fontSize: '0.75rem',
                        py: 0.5,
                        px: 1,
                        borderRadius: 1
                      }}
                    >
                      Main
                    </Box>
                  )}
                </Box>
                <CardActions sx={{ justifyContent: 'space-between' }}>
                  <Tooltip title={image.isMain ? "已设为主图" : "设为主图"}>
                    <IconButton 
                      size="small" 
                      color={image.isMain ? "primary" : "default"}
                      onClick={() => handleSetMainImage(image.id)}
                      disabled={image.isMain}
                    >
                      {image.isMain ? <StarIcon /> : <StarBorderIcon />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="删除图片">
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => handleDeleteImage(image.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ImageUploader; 