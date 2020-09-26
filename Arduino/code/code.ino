#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266HTTPClient.h>
#include <Adafruit_Sensor.h>
#include <DHT.h>
 
/* Set these to your desired credentials. */
const char *ssid = "946252024wifi";  //ENTER YOUR WIFI SETTINGS
const char *password = "44117650";
 
const char *host = "192.168.100.19:3000";
//const char *host = "http://osmarpj.com";

#define DHTPIN D2
#define DHTTYPE    DHT22
DHT dht(DHTPIN, DHTTYPE);
float t = 0.0;
float h = 0.0;
//=======================================================================
//                    Power on setup
//=======================================================================
 
void setup() {
  delay(1000);
  Serial.begin(115200);
  WiFi.mode(WIFI_OFF);        //Prevents reconnection issue (taking too long to connect)
  delay(1000);
  WiFi.mode(WIFI_STA);        //This line hides the viewing of ESP as wifi hotspot
  dht.begin();
  
  WiFi.begin(ssid, password);     //Connect to your WiFi router
  Serial.println("");
 
  Serial.print("Connecting");
  // Wait for connection
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
 
  //If connection successful show IP address in serial monitor
  Serial.println("");
  Serial.print("Connected to ");
  Serial.println(ssid);
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());  //IP address assigned to your ESP
}
 
//=======================================================================
//                    Main Program Loop
//=======================================================================
void loop() {
  HTTPClient http;    //Declare object of class HTTPClient
  String postData;
  t = dht.readTemperature();
  h = dht.readHumidity();
  //Post Data
  postData = " {\"temperature\":" + String(t) + ", \"humidity\":" + String(h) + " } ";
  //postData = "{\"temperature\":" + String(t) + "}";
  
  http.begin("http://192.168.100.19:3000/api/parametro");              //Specify request destination
  http.addHeader("Content-Type", "application/json");    //Specify content-type header
 
  int httpCode = http.POST(postData);   //Send the request
  String payload = http.getString();    //Get the response payload
 
  Serial.println(httpCode);   //Print HTTP return code
  Serial.println(payload);    //Print request response payload
  Serial.println(t);
  Serial.println(h);
 
  http.end();  //Close connection
  
  //delay(1000 * 60 * 5);  //Post Data at every 5 minutes
  delay(5000);
}
