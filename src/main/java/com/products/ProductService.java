package com.products;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProductService {
	@Autowired
	private ProductRepository repo;

	public List<ProductEntity> getPrducts() {
		return repo.findAll();
	}

	public ProductEntity getProductById(Long id) {
		return repo.findById(id).orElse(new ProductEntity());
	}

	public ProductEntity postProduct(ProductEntity prod) {
		return repo.save(prod);
	}

	public ProductEntity updateProduct(Long id, ProductEntity prod) {
		ProductEntity product=repo.findById(id).orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
		product.setTitle(prod.getTitle());
		product.setPrice(prod.getPrice());
		product.setDescription(prod.getDescription());
		product.setCategory(prod.getCategory());
		product.setImage(prod.getImage());
		product.setRate(prod.getRate());
		product.setCount(prod.getCount());
		
		return repo.save(product);
	}

	public void delteProduct(Long id) {
		if(!repo.existsById(id)) {
			throw new RuntimeException("Id not found");
		}
		repo.deleteById(id);
	}
	
	
}
