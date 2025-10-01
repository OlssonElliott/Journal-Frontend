# Min Journal – Frontend

Här är en kort guide för att komma igång med frontend lokalt. Kräver att man först startat backend: 
https://github.com/OlssonElliott/Journal-Backend

## Krav
- Node 20+
- pnpm 9+ (eller byt ut kommandona mot npm/yarn om du hellre kör det)

## Kom igång

```bash
pnpm install
pnpm start
```

Servern är sedan igång på `http://localhost:4200/`.

## Miljövariabler
Skapa en `.env` i projektroten för att nå backend via localhost. Exempel:

```
VITE_API_BASE_URL=http://localhost:8080
```

## Konton
När backenden väl är igång:
1. Öppna `http://localhost:4200/`
2. Skapa konto 
3. Logga in och skriv dagboksinlägg + kolla statistik


