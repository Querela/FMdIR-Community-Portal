import static spark.Spark.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import org.apache.commons.validator.routines.UrlValidator;
import com.google.gson.Gson;

public class Main {
    
    public static void main(String[] args) {
        // Init needed objects, GSON
        Gson gson = new Gson();
        
        // load static files from public folder
        staticFileLocation("/public");
        
        // Declare REST-API
        // ================
        // start session per request
        get("/api/startSession", (request, response) -> {
            request.session(true);
            response.type("application/json");
            Thread.sleep(1000);
            return "{\"sessionState\": \"started\"}";
        });
        
        // add url's to session list
        post("/api/addurl", (request, response) -> {
            response.type("application/json");
            // FOR TESTING ONLY! Simulate Network delay
            Thread.sleep(1000);
            UrlValidator urlValidator = new UrlValidator();
            //System.out.println( );
            if( urlValidator.isValid(request.queryParams("url")) ){
                List<String> urlList;
                // check if object already exist
                if( request.session().attribute("urlList") == null){
                    urlList = new ArrayList<String>();
                } else {
                    urlList = request.session().attribute("urlList");
                }
                if(urlInDb(request.queryParams("url"))){
                    return "{\"uploadState\": \"alreadyExist\"}";
                }
                urlList.add( request.queryParams(":url") );
                request.session().attribute("urlList", urlList);
                return "{\"uploadState\": \"ok\"}";
            } else {
                return "{\"uploadState\": \"invalidUrl\"}";
            }
         });
        
        // add language to session      
        post("/api/addlanguage", (request, response) -> {
            response.type("application/json");
         // FOR TESTING ONLY! Simulate Network delay
            Thread.sleep(1000);
            // validate language!
            if( true ){
                request.session().attribute("language",  request.queryParams("language") );
                return "{\"uploadState\": \"ok\"}";
            } else {
                return "{\"uploadState\": \"invalidLanguage\"}";
            }
         });
        
        // return the crawling state of some urls (get a ticket)    
        post("/api/getresult", (request, response) -> {
            response.type("application/json");
            // ckeck if ready
            if( true ){
                return "{\"result\": \"ready\", \"urls\": \"456\", \"sentences\": \"15.857\"}";
            } else {
                return "{\"result\": \"wait\"}";
            }
         });
        
        // request a ticket and and submitt data to hetrix
        get("/api/getticket", (request, response) -> {
            response.type("application/json");
            String token = getTicket( request.session().attribute("language"), request.session().attribute("urlList") );
            return "{\"ticketid\": \"" + token + "\"}";
        });
        
        
        // reset all session data
        get("/api/clearsession", (request, response) -> {
            response.type("application/json");
            // FOR TESTING ONLY! Simulate Network delay
            Thread.sleep(1000);
            if( request.session().attribute("urlList") == null){
                return "{\"sessionState\": \"empty\"}";
            } else {
                List<String> urlList = request.session().attribute("urlList");
                urlList.clear();
                request.session().attribute("language",  "" );
                return "{\"sessionState\": \"cleared\"}";
            }
        });
        
        
        // Home dir, deliver root website
        get("/", (request, response) -> "root");
        
        // Filter catch root request and redirect to index html file
        before("/", (request, response) -> {
            response.redirect("index.html");
        });
    }
    
    private static boolean urlInDb(String language){
        // this function should connect to db and perform a look up for insert url
        int num = (int)((Math.random()) * 10 + 1);
        if (num > 8) {
            return true;
        } else {
            return false;
        }
        
    }
    
    private static String getTicket(String language, List<String> urls){
        // this function should push data to hetrix and return a user ticket id
        final char[] ZEICHEN = { 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', '5', '6', '7' }; 
        Random randomno = new Random();
        String token = "";
        for ( int i=0; i<11; i++ ) {
           int iIndex = randomno.nextInt( ZEICHEN.length );
           token += ZEICHEN[ iIndex ] ;
        }
        return token;
    }
}