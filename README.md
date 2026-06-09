# Shimi Looks ✨

אפליקציית Web מעוצבת בעברית RTL לבחירת שילובי צבעים לבגדים, עם מנוע גיוון חכם בהשראת *A Dictionary of Color Combinations* של Sanzo Wada.

## מה יש בפנים
- מסך בית עם **השילוב של היום**
- כפתור **תני עוד שילוב**
- כפתור **תני לי עוד 3 שילובים**
- **לוקבוק** – כל מה שנשמר נחשב ללוק שנבחר
- הסבר **למה זה עובד?** לכל לוק
- אייקון + manifest + service worker כדי שזה ירגיש כמו אפליקציה אמיתית
- שמירה מקומית ב-`localStorage`

## איך מעלים ל-GitHub Pages
1. לפתוח Repository חדש ב-GitHub
2. להעלות את כל הקבצים מהזיפ
3. להיכנס ל-Settings → Pages
4. לבחור **Deploy from a branch**
5. Branch: `main` / folder: `/root`
6. לשמור ולהמתין כמה דקות

## התקנה באייפון
לפתוח את הלינק בספארי → Share → Add to Home Screen.

## קבצים
- `index.html`
- `style.css`
- `script.js`
- `manifest.webmanifest`
- `sw.js`
- `assets/`


## v4 תיקון טעינה
- הקבצים בזיפ הזה נמצאים בשורש הזיפ, לא בתוך תיקייה.
- נוספו cache-busters ל-style/script/manifest.
- בוטל service worker כדי למנוע מצב שהאתר נתקע על גרסה ישנה.
