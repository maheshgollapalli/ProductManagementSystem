package com.products;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;  // <-- important import for passing data to Thymeleaf
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;

@Controller
public class ProductController {
    
    @Autowired
    private ProductService service;

    @ResponseBody
    @GetMapping("/products")
    public List<ProductEntity> getAll() {
        return service.getPrducts();
    }
    
    @ResponseBody
    @GetMapping("products/{id}")
    public ProductEntity getById(@PathVariable Long id) {
        return service.getProductById(id);
    }

    @ResponseBody
    @PostMapping("/products")
    public ProductEntity addProduct(@RequestBody ProductEntity prod) {
        return service.postProduct(prod);
    }

    @ResponseBody
    @PutMapping("/products/{id}")
    public ProductEntity updateProduct(@PathVariable Long id, @RequestBody ProductEntity prod) {
        return service.updateProduct(id, prod);
    }

    @ResponseBody
    @DeleteMapping("/products/{id}")
    public void deleteProduct(@PathVariable Long id) {
        service.delteProduct(id);
    }

    // --------------------- HTML PAGES ---------------------
    
    @GetMapping("/adminpage")
    public String openAdminPage(Model model) {
        List<ProductEntity> products = service.getPrducts();
        model.addAttribute("products", products);
        return "admin";  
    }

    @GetMapping("/userpage")
    public String openUserPage(Model model) {
        List<ProductEntity> products = service.getPrducts();
        model.addAttribute("products", products);
        return "user";   
    }
    
    @RequestMapping("/indexpage")
    public String getRequest() {
        return "index";
    }
    
    @RequestMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();  
        return "redirect:/indexpage";  
    }
    
    
}
