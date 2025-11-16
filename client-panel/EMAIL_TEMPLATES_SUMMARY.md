# 📧 Résumé des Templates d'E-mails

## ✅ Templates Créés

J'ai créé **3 templates d'e-mails professionnels en français** pour votre application :

### 1. **Confirmation de Création de Compte** 
📁 `src/templates/emails/AccountConfirmation.tsx`

**Quand l'utiliser :** Lorsqu'un utilisateur crée un nouveau compte et doit confirmer son adresse e-mail.

**Caractéristiques :**
- Message de bienvenue chaleureux
- Bouton d'action principal "Confirmer mon compte"
- Indication de la durée de validité du lien (par défaut : 24 heures)
- Lien alternatif si le bouton ne fonctionne pas
- Message de sécurité pour rassurer l'utilisateur

---

### 2. **Réinitialisation de Mot de Passe**
📁 `src/templates/emails/PasswordReset.tsx`

**Quand l'utiliser :** Lorsqu'un utilisateur demande à réinitialiser son mot de passe oublié.

**Caractéristiques :**
- Instructions claires pour réinitialiser le mot de passe
- Bouton d'action "Réinitialiser mon mot de passe"
- Durée de validité limitée (par défaut : 1 heure)
- Avertissement si l'utilisateur n'a pas fait la demande
- Conseils de sécurité détaillés

---

### 3. **Compte Verrouillé (3 tentatives)**
📁 `src/templates/emails/AccountLocked.tsx`

**Quand l'utiliser :** Après 3 tentatives de connexion échouées consécutives.

**Caractéristiques :**
- Alerte de sécurité visible
- Tableau d'informations avec :
  - Nombre de tentatives échouées
  - Durée du verrouillage (par défaut : 30 minutes)
  - Adresse IP (optionnel)
  - Date et heure de la tentative (optionnel)
- Bouton "Déverrouiller mon compte maintenant"
- Instructions détaillées pour l'utilisateur
- Conseils de sécurité étendus

---

## 🎨 Design et Style

Tous les templates partagent le même design professionnel :

✅ **Couleurs de marque** : Rouge #DC0032 et #B80029  
✅ **Responsive** : S'adapte parfaitement aux mobiles et desktops  
✅ **Header avec dégradé** : Logo sur fond rouge élégant  
✅ **Boutons d'action clairs** : CTA (Call-to-Action) bien visible  
✅ **Info boxes** : Sections importantes en surbrillance  
✅ **Footer complet** : Liens utiles et copyright  
✅ **Sécurité** : Messages et conseils de sécurité inclus  

---

## 📂 Structure des Fichiers

```
src/
└── templates/
    └── emails/
        ├── AccountConfirmation.tsx     # Template confirmation de compte
        ├── PasswordReset.tsx           # Template reset mot de passe
        ├── AccountLocked.tsx           # Template compte verrouillé
        ├── index.ts                    # Export de tous les templates
        └── README.md                   # Documentation complète

src/pages/
└── EmailTemplatesPreview.tsx           # Page d'aperçu des templates
```

---

## 🚀 Comment Utiliser les Templates

### Option 1 : Génération HTML pour Backend

```typescript
import { generateAccountConfirmationEmailHTML } from './templates/emails';

// Générer le HTML
const emailHTML = generateAccountConfirmationEmailHTML(
  "Jean Dupont",                                  // Nom utilisateur
  "https://votresite.com/confirm?token=abc123",   // Lien de confirmation
  "24 heures"                                     // Durée de validité
);

// Envoyer avec votre service d'email (Nodemailer, SendGrid, etc.)
await sendEmail({
  to: "user@example.com",
  subject: "Confirmez votre compte",
  html: emailHTML
});
```

### Option 2 : Visualiser dans le Navigateur

**Accédez à la page de prévisualisation :** 
👉 **http://localhost:5173/email-templates**

Cette page vous permet de :
- ✅ Visualiser les 3 templates en temps réel
- ✅ Modifier les paramètres (nom, liens, durées, etc.)
- ✅ Copier le HTML dans le presse-papier
- ✅ Télécharger le template en fichier HTML

---

## 📋 Exemples d'Utilisation

### 1. Lors de l'Inscription

```typescript
// Route d'inscription
app.post('/api/register', async (req, res) => {
  const { email, password, name } = req.body;
  
  // Créer l'utilisateur
  const user = await createUser({ email, password, name });
  
  // Générer token
  const token = generateConfirmationToken(user.id);
  const confirmLink = `${APP_URL}/confirm?token=${token}`;
  
  // Envoyer l'email
  const html = generateAccountConfirmationEmailHTML(name, confirmLink);
  await sendEmail(email, "Confirmez votre compte", html);
  
  res.json({ message: 'Compte créé. Vérifiez votre email.' });
});
```

### 2. Demande de Reset Password

```typescript
app.post('/api/reset-password-request', async (req, res) => {
  const { email } = req.body;
  
  const user = await findUserByEmail(email);
  if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' });
  
  // Générer token
  const token = generateResetToken(user.id);
  const resetLink = `${APP_URL}/reset?token=${token}`;
  
  // Envoyer l'email
  const html = generatePasswordResetEmailHTML(user.name, resetLink, "1 heure");
  await sendEmail(email, "Réinitialisation de mot de passe", html);
  
  res.json({ message: 'Email envoyé' });
});
```

### 3. Compte Verrouillé

```typescript
// Après 3 tentatives échouées
const failedAttempts = await getFailedLoginAttempts(userId);

if (failedAttempts >= 3) {
  // Verrouiller le compte
  await lockAccount(userId, 30); // 30 minutes
  
  // Générer token de déverrouillage
  const token = generateUnlockToken(userId);
  const unlockLink = `${APP_URL}/unlock?token=${token}`;
  
  // Envoyer l'email d'alerte
  const html = generateAccountLockedEmailHTML(
    user.name,
    unlockLink,
    3,                              // Nombre de tentatives
    "30 minutes",                   // Durée verrouillage
    req.ip,                         // Adresse IP
    new Date().toLocaleString('fr-FR')  // Date/heure
  );
  
  await sendEmail(user.email, "⚠️ Compte verrouillé", html);
  
  return res.status(403).json({ error: 'Compte verrouillé' });
}
```

---

## 🔧 Configuration Recommandée

### Variables d'Environnement

```env
# URL de l'application
APP_URL=https://votresite.com

# Configuration email
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=noreply@votresite.com
EMAIL_PASSWORD=votre_mot_de_passe

# Durées de validité des tokens
CONFIRMATION_TOKEN_EXPIRY=24h
RESET_TOKEN_EXPIRY=1h
UNLOCK_TOKEN_EXPIRY=30m
```

---

## 📝 Personnalisation

Pour personnaliser les templates selon votre marque :

1. **Logo** : Remplacez "Votre Logo" dans les headers
2. **Couleurs** : Modifiez #DC0032 et #B80029 dans les CSS
3. **Footer** : Ajoutez vos vrais liens (centre d'aide, contact, etc.)
4. **Nom entreprise** : Remplacez "Votre Entreprise" par votre nom

---

## ✨ Fonctionnalités Incluses

✅ Design responsive (mobile + desktop)  
✅ Boutons d'action clairs et visibles  
✅ Liens alternatifs en texte  
✅ Messages de sécurité  
✅ Conseils de bonnes pratiques  
✅ Footer professionnel  
✅ Emojis pour meilleure lisibilité  
✅ Durées de validité configurables  
✅ Informations optionnelles (IP, date/heure)  

---

## 🔐 Sécurité

Les templates intègrent des bonnes pratiques de sécurité :

- ⏱️ Expiration des liens (tokens avec durée limitée)
- ⚠️ Alertes si l'utilisateur n'a pas initié l'action
- 🔒 Conseils de sécurité dans chaque email
- 📋 Instructions claires pour éviter le phishing
- 🛡️ Messages rassurants pour les utilisateurs légitimes

---

## 📚 Documentation

La documentation complète est disponible dans :
📄 **src/templates/emails/README.md**

Elle contient :
- Exemples de code détaillés
- Tous les paramètres disponibles
- Intégration avec Nodemailer
- Bonnes pratiques
- Tests et débogage

---

## 🎯 Routes Ajoutées

### Page de Reset Password
- **Route** : `/reset`
- **Fichier** : `src/pages/ResetPasswordConfirm.tsx`
- **Usage** : `https://votresite.com/reset?token=abc123`

### Page de Prévisualisation
- **Route** : `/email-templates`
- **Fichier** : `src/pages/EmailTemplatesPreview.tsx`
- **Usage** : Visualiser et tester les templates

---

## 🎨 Aperçu Visuel

Accédez à **http://localhost:5173/email-templates** pour voir :
- 🎨 Rendu complet de chaque template
- ⚙️ Configuration en temps réel
- 📋 Copie rapide du HTML
- 💾 Téléchargement des templates

---

## ✅ Prochaines Étapes

1. **Testez les templates** : Visitez `/email-templates`
2. **Personnalisez** : Modifiez logo, couleurs, footer
3. **Intégrez au backend** : Utilisez les fonctions `generate...EmailHTML()`
4. **Configurez l'envoi** : Setup Nodemailer, SendGrid ou autre
5. **Testez en production** : Envoyez des emails de test

---

## 🆘 Support

Pour toute question :
- Consultez `src/templates/emails/README.md`
- Testez sur `/email-templates`
- Vérifiez les exemples de code dans chaque template

---

**Créé avec ❤️ en français pour votre application**
