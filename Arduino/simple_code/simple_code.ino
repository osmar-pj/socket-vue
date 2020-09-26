#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include <Adafruit_Sensor.h>
#include <DHT.h>

#define DHTPIN D2
#define DHTTYPE    DHT22
DHT dht(DHTPIN, DHTTYPE);
float t = 0.0;
float h = 0.0;
 
void setup() {
 
  Serial.begin(115200);                                  //Serial connection
  WiFi.begin("946252024wifi", "44117650");   //WiFi connection
 
  while (WiFi.status() != WL_CONNECTED) {  //Wait for the WiFI connection completion
    delay(500); 
    Serial.println("Waiting for connection");
  }
  Serial.println(WiFi.localIP());
}
 
void loop() {
 
 if(WiFi.status()== WL_CONNECTED){   //Check WiFi connection status
 
   HTTPClient http;    //Declare object of class HTTPClient

   String postData;
   t = dht.readTemperature();
   h = dht.readHumidity();
   //Post Data
   postData = " {\"temperature\":" + String(t) + ", \"humedad\":" + String(h) + " } ";
   
   http.begin("http://192.168.100.19:3000/api/parametro");      //Specify request destination
   http.addHeader("Content-Type", "application/json");  //Specify content-type header
 
   int httpCode = http.POST(postData);   //Send the request
   String payload = http.getString();                  //Get the response payload
 
   Serial.println(httpCode);   //Print HTTP return code
   Serial.println(payload);    //Print request response payload
   Serial.println(t);
   Serial.println(h);
   
   http.end();  //Close connection
 
 }else{
 
    Serial.println("Error in WiFi connection");   
 
 }
 
  delay(2000);  //Send a request every 30 seconds
 
}
