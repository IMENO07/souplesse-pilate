package souplesse_pilates.studio.souplesse_pilates.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Routes all legacy and clean paths to the SPA shell.
 * The frontend is a single-page application (index.html) with hash-based routing.
 */
@Controller
public class HomeController {

    @GetMapping("/")
    public String index() {
        return "forward:/index.html";
    }

    @GetMapping("/login")
    public String login() {
        return "redirect:/#/login";
    }

    @GetMapping("/login.html")
    public String loginHtml() {
        return "redirect:/#/login";
    }

    @GetMapping("/admin")
    public String admin() {
        return "redirect:/#/admin";
    }

    @GetMapping("/admin.html")
    public String adminHtml() {
        return "redirect:/#/admin";
    }
}