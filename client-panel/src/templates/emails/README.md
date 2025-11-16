# Templates d'E-mails

Ce dossier contient tous les templates d'e-mails utilisés dans l'application, en français.

## 📧 Templates Disponibles

### 1. **AccountConfirmation.tsx** - Confirmation de création de compte
Envoyé lorsqu'un utilisateur crée un nouveau compte et doit confirmer son adresse e-mail.

**Utilisation :**
```typescript
import { generateAccountConfirmationEmailHTML } from './templates/emails';

const emailHTML = generateAccountConfirmationEmailHTML(
  "Jean Dupont",                                    // Nom de l'utilisateur
  "https://votresite.com/confirm?token=abc123",    // Lien de confirmation
  "24 heures"                                       // Durée de validité (optionnel)
);

// Envoyer l'email avec votre service d'envoi
await sendEmail({
  to: "jean.dupont@example.com",
  subject: "Confirmez votre compte",
  html: emailHTML
});
```

**Paramètres :**
- `userName` (string) : Nom de l'utilisateur
- `confirmationLink` (string) : URL complète avec le token de confirmation
- `expirationTime` (string, optionnel) : Durée de validité du lien (défaut: "24 heures")

---

### 2. **PasswordReset.tsx** - Réinitialisation de mot de passe
Envoyé lorsqu'un utilisateur demande à réinitialiser son mot de passe.

**Utilisation :**
```typescript
import { generatePasswordResetEmailHTML } from './templates/emails';

const emailHTML = generatePasswordResetEmailHTML(
  "Jean Dupont",                                    // Nom de l'utilisateur
  "https://votresite.com/reset?token=xyz789",      // Lien de réinitialisation
  "1 heure"                                         // Durée de validité (optionnel)
);

// Envoyer l'email
await sendEmail({
  to: "jean.dupont@example.com",
  subject: "Réinitialisation de votre mot de passe",
  html: emailHTML
});
```

**Paramètres :**
- `userName` (string) : Nom de l'utilisateur
- `resetLink` (string) : URL complète avec le token de réinitialisation
- `expirationTime` (string, optionnel) : Durée de validité du lien (défaut: "1 heure")

---

### 3. **AccountLocked.tsx** - Compte verrouillé après tentatives multiples
Envoyé lorsqu'un compte est verrouillé après 3 tentatives de connexion échouées.

**Utilisation :**
```typescript
import { generateAccountLockedEmailHTML } from './templates/emails';

const emailHTML = generateAccountLockedEmailHTML(
  "Jean Dupont",                                    // Nom de l'utilisateur
  "https://votresite.com/unlock?token=def456",     // Lien de déverrouillage
  3,                                                // Nombre de tentatives (optionnel)
  "30 minutes",                                     // Durée du verrouillage (optionnel)
  "192.168.1.1",                                    // Adresse IP (optionnel)
  "15/01/2024 à 14:30"                             // Date/heure (optionnel)
);

// Envoyer l'email
await sendEmail({
  to: "jean.dupont@example.com",
  subject: "⚠️ Votre compte a été temporairement verrouillé",
  html: emailHTML
});
```

**Paramètres :**
- `userName` (string) : Nom de l'utilisateur
- `unlockLink` (string) : URL complète avec le token de déverrouillage
- `attemptCount` (number, optionnel) : Nombre de tentatives échouées (défaut: 3)
- `lockDuration` (string, optionnel) : Durée du verrouillage (défaut: "30 minutes")
- `ipAddress` (string, optionnel) : Adresse IP de la tentative
- `attemptTime` (string, optionnel) : Date et heure de la tentative

---

## 🎨 Caractéristiques des Templates

✅ **Design responsive** - Optimisé pour mobile et desktop
✅ **Couleurs de marque** - Utilise le rouge #DC0032 de votre charte graphique
✅ **Accessibilité** - HTML sémantique et structure claire
✅ **Sécurité** - Messages de sécurité et bonnes pratiques inclus
✅ **Professionnel** - Design moderne et épuré
✅ **En français** - Tous les textes sont en français

---

## 🛠️ Structure des Templates

Chaque template comprend :

1. **Header** - Logo et titre sur fond rouge dégradé
2. **Content** - Message principal avec bouton d'action
3. **Info boxes** - Informations importantes en surbrillance
4. **Alternative link** - Lien texte si le bouton ne fonctionne pas
5. **Security notice** - Conseils de sécurité
6. **Footer** - Liens utiles et copyright

---

## 📝 Personnalisation

Pour personnaliser les templates :

1. **Logo** : Remplacez "Votre Logo" dans le header par votre logo/nom
2. **Couleurs** : Modifiez les couleurs #DC0032 et #B80029 dans les styles CSS
3. **Footer links** : Ajoutez les vrais liens vers votre centre d'aide, contact, etc.
4. **Copyright** : Remplacez "Votre Entreprise" par le nom de votre entreprise

---

## 💡 Exemple d'Intégration Complète

### Backend (Node.js avec Nodemailer)

```typescript
import nodemailer from 'nodemailer';
import { generateAccountConfirmationEmailHTML } from './templates/emails';

// Configuration du transporteur d'email
const transporter = nodemailer.createTransport({
  host: 'smtp.example.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Fonction d'envoi d'email de confirmation
export async function sendConfirmationEmail(
  userEmail: string,
  userName: string,
  confirmationToken: string
) {
  const confirmationLink = `${process.env.APP_URL}/confirm?token=${confirmationToken}`;
  const emailHTML = generateAccountConfirmationEmailHTML(userName, confirmationLink);

  await transporter.sendMail({
    from: '"Votre Entreprise" <noreply@votreentreprise.com>',
    to: userEmail,
    subject: 'Confirmez votre compte',
    html: emailHTML
  });
}
```

### Lors de l'inscription d'un utilisateur

```typescript
// Dans votre route d'inscription
app.post('/api/register', async (req, res) => {
  const { email, password, name } = req.body;
  
  // Créer l'utilisateur dans la base de données
  const user = await createUser({ email, password, name });
  
  // Générer un token de confirmation
  const confirmationToken = generateToken(user.id);
  
  // Envoyer l'email de confirmation
  await sendConfirmationEmail(email, name, confirmationToken);
  
  res.json({ message: 'Compte créé. Vérifiez votre email.' });
});
```

---

## 🔐 Sécurité

Les templates incluent des messages de sécurité importants :

- **Expiration des liens** : Tous les liens ont une durée de validité limitée
- **Alertes de sécurité** : Messages d'avertissement si l'utilisateur n'a pas initié l'action
- **Conseils** : Bonnes pratiques de sécurité incluses dans chaque email
- **Protection contre le phishing** : Instructions claires pour vérifier l'authenticité

---

## 📱 Test des Templates

Pour tester visuellement un template :

```typescript
import ReactDOMServer from 'react-dom/server';
import AccountConfirmationEmail from './templates/emails/AccountConfirmation';

const html = ReactDOMServer.renderToStaticMarkup(
  <AccountConfirmationEmail
    userName="Jean Dupont"
    confirmationLink="https://example.com/confirm?token=test123"
    expirationTime="24 heures"
  />
);

// Sauvegarder dans un fichier pour visualisation
fs.writeFileSync('test-email.html', html);
```

---

## 📚 Bonnes Pratiques

1. **Toujours utiliser HTTPS** pour les liens dans les emails
2. **Générer des tokens sécurisés** (au moins 32 caractères aléatoires)
3. **Limiter la durée de validité** des tokens (24h max pour confirmation, 1h pour reset)
4. **Logger les envois d'emails** pour tracer les problèmes
5. **Gérer les erreurs d'envoi** et réessayer si nécessaire
6. **Respecter le RGPD** - inclure un lien de désinscription si applicable

---

## 🆘 Support

Pour toute question sur l'utilisation des templates :
- Consultez ce README
- Vérifiez les exemples de code dans chaque template
- Testez localement avant de déployer en production
