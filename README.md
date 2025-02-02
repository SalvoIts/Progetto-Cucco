# SEO Competitiveness Analysis

Questo progetto è stato sviluppato come consegna del progetto finale del modulo del Professor Cucco. L'applicativo offre un’interfaccia intuitiva per effettuare analisi enterprise-level sulla competitività di mercato di siti web pubblici.

---

## Panoramica

L’applicazione è composta da due principali componenti:

- **Backend**: Realizzato in Python con Flask, si occupa di:
  - Effettuare operazioni di web scraping sulle SERP utilizzando Selenium e BeautifulSoup.
  - Analizzare i contenuti dei siti (estrazione di titoli, metadati, header e keyword density).
  - Gestire le richieste API e salvare i risultati in formato CSV.

- **Frontend**: Sviluppato in React, offre:
  - Un'interfaccia user-friendly per l'inserimento della keyword, visualizzazione dei risultati (in forma tabellare e grafica) e scaricamento dei dati.

---

## Avvertimenti

> **Warning**: La configurazione attuale del backend utilizza **Safari** come driver per Selenium. Assicurarsi che Safari sia installato e configurato correttamente sul sistema per eseguire il web scraping. In caso di necessità, modificare il driver in `scraper.py` per utilizzare un browser alternativo.

