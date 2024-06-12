#include <SPI.h>
#include <MFRC522.h>
#include <ESP8266WiFi.h>
#include <WiFiUdp.h>
#include <SimpleTimer.h>
#include <NTPClient.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>

#define SS_PIN 4
#define RST_PIN 2

int lock = D1;

MFRC522 mfrc522(RST_PIN, SS_PIN);
const char* ssid = "510";   //Nome do wifi
const char* pass = "997723020";   //Senha do wifi

const String serverURL = "http://192.168.1.9:8800";

WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org");

SimpleTimer timer;

void setup(void){
    Serial.begin(9600);
    WiFi.begin(ssid, pass);
    Serial.println();
    Serial.print("Conectando");
    while (WiFi.status() != WL_CONNECTED){
      delay(500);
      Serial.print(".");
    }
    Serial.println("");
    Serial.println("WiFi Conectado!");
    Serial.println(WiFi.localIP()); 
    timeClient.begin();
    timeClient.setTimeOffset(-10800);
    pinMode(lock, OUTPUT);
    digitalWrite(lock, HIGH);
    SPI.begin();
    mfrc522.PCD_Init();
    timer.setInterval(1000L, iot_rfid);
}

void loop() {
    timeClient.update();
    timer.run();
}

void iot_rfid() {
    MFRC522::MIFARE_Key key;
    for (byte i = 0; i < 6; i++) {
        key.keyByte[i] = 0xFF;
    }

    if (!mfrc522.PICC_IsNewCardPresent()) {
        return;
    }

    if (!mfrc522.PICC_ReadCardSerial()) {
        return;
    }

    String cardUID = "";
    for (byte i = 0; i < mfrc522.uid.size; i++) {
        cardUID += String(mfrc522.uid.uidByte[i], DEC);
    } 

    byte piccType = mfrc522.PICC_GetType(mfrc522.uid.sak);
    if (piccType != MFRC522::PICC_TYPE_MIFARE_MINI 
        && piccType != MFRC522::PICC_TYPE_MIFARE_1K
        && piccType != MFRC522::PICC_TYPE_MIFARE_4K) {
        return;
    }

    time_t epochTime = timeClient.getEpochTime();
    struct tm *ptm = gmtime((time_t *)&epochTime);
    int currentHour = timeClient.getHours();
    int currentMinute = timeClient.getMinutes();
    int monthDay = ptm->tm_mday;
    int currentMonth = ptm->tm_mon + 1;
    int currentYear = ptm->tm_year + 1900;
    String currentDate = String(monthDay) + "/" + String(currentMonth) + "/" + String(currentYear);
    String formattedTime = timeClient.getFormattedTime();

    if (WiFi.status() == WL_CONNECTED) {
        if (!isCardRegistered(cardUID)) {
            registerCard(cardUID);
        } else {
            checkCardStatusAndRegisterAccess(cardUID, currentDate, formattedTime);
        }
    } else {
        Serial.println("WiFi não conectado");
    }
}

bool isCardRegistered(String cardUID) {
    WiFiClient client;
    HTTPClient http;
    String url = serverURL + "/Codigo/" + cardUID;
    http.begin(client, url);
    int httpCode = http.GET();
    bool registered = false;

    if (httpCode > 0) {
        String payload = http.getString();
        Serial.println(payload);
        if (payload.length() > 2) {
            registered = true;
        }
    } else {
        Serial.printf("Falha na requisição GET, erro: %s\n", http.errorToString(httpCode).c_str());
    }

    http.end();
    return registered;
}

void registerCard(String cardUID) {
    WiFiClient client;
    HTTPClient http;
    String url = serverURL + "/salvarDados";
    http.begin(client, url);
    http.addHeader("Content-Type", "application/json");

    String jsonPayload = "{\"codigo\":\"" + cardUID + "\",\"nome\":\"\",\"telefone\":\"\",\"cpf\":\"\",\"nascimento\":\"\",\"status\":\"Não cadastrado\"}";
    int httpCode = http.POST(jsonPayload);
    if (httpCode > 0) {
        String payload = http.getString();
        Serial.println(payload);
    } else {
        Serial.printf("Falha na requisição POST para salvarDados, erro: %s\n", http.errorToString(httpCode).c_str());
    }

    http.end();
}

void checkCardStatusAndRegisterAccess(String cardUID, String currentDate, String formattedTime) {
    WiFiClient client;
    HTTPClient http;
    String url = serverURL + "/Codigo/" + cardUID;
    http.begin(client, url);
    int httpCode = http.GET();
    bool accessGranted = false;

    if (httpCode > 0) {
        String payload = http.getString();
        Serial.println(payload);

        if (payload.indexOf("\"status\":\"cadastrado\"") > 0) {
            accessGranted = true;
        } else if (payload.indexOf("\"status\":\"bloqueado\"") > 0 || payload.indexOf("\"status\":\"não cadastrado\"") > 0) {
            accessGranted = false;
        }
    } else {
        Serial.printf("Falha na requisição GET para verificar status, erro: %s\n", http.errorToString(httpCode).c_str());
    }

    http.end();

    if (accessGranted) {
        digitalWrite(lock, LOW);
        delay(5000);
        digitalWrite(lock, HIGH);
    }

    WiFiClient client2;
    HTTPClient http2;
    String url2 = serverURL + "/registrarAcesso";
    http2.begin(client2, url2);  // Use a nova API com WiFiClient
    http2.addHeader("Content-Type", "application/json");

    String jsonPayload = "{\"codigo_acesso\":\"" + cardUID + "\",\"status_acesso\":\"" + (accessGranted ? "1" : "0") + "\",\"data_acesso\":\"" + currentDate + "\",\"hora_acesso\":\"" + formattedTime + "\"}";
    int httpCode2 = http2.POST(jsonPayload);
    if (httpCode2 > 0) {
        String payload2 = http2.getString();
        Serial.println(payload2);
    } else {
        Serial.printf("Falha na requisição POST para registrarAcesso, erro: %s\n", http2.errorToString(httpCode2).c_str());
    }

    http2.end();

    resetFunc();
}

void resetFunc(){
  ESP.reset();
}
