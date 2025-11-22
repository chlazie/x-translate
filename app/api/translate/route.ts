import { NextResponse } from 'next/server';

// Function to strip HTML tags from text
function stripHtmlTags(text: string): string {
  return text.replace(/<[^>]*>/g, '');
}

// Your existing translation database...
const translationDatabase: Record<string, Record<string, string>> = {
  'en': {
    'fr': 'bonjour', 'es': 'hola', 'de': 'hallo', 'it': 'ciao', 'pt': 'olá',
    'ja': 'こんにちは', 'ko': '안녕하세요', 'zh': '你好', 'ar': 'مرحبا', 'ru': 'здравствуйте'
  },
  'woman': {
    'fr': 'femme', 'es': 'mujer', 'de': 'frau', 'it': 'donna', 'pt': 'mulher',
    'ja': '女性', 'ko': '여성', 'zh': '女人', 'ar': 'امرأة', 'ru': 'женщина'
  },
  'man': {
    'fr': 'homme', 'es': 'hombre', 'de': 'mann', 'it': 'uomo', 'pt': 'homem',
    'ja': '男性', 'ko': '남성', 'zh': '男人', 'ar': 'رجل', 'ru': 'мужчина'
  },
  'hello': {
    'fr': 'bonjour', 'es': 'hola', 'de': 'hallo', 'it': 'ciao', 'pt': 'olá',
    'ja': 'こんにちは', 'ko': '안녕하세요', 'zh': '你好', 'ar': 'مرحبا', 'ru': 'здравствуйте'
  },
  'thank you': {
    'fr': 'merci', 'es': 'gracias', 'de': 'danke', 'it': 'grazie', 'pt': 'obrigado',
    'ja': 'ありがとう', 'ko': '감사합니다', 'zh': '谢谢', 'ar': 'شكرا', 'ru': 'спасибо'
  },
  'goodbye': {
    'fr': 'au revoir', 'es': 'adiós', 'de': 'auf wiedersehen', 'it': 'arrivederci', 'pt': 'adeus',
    'ja': 'さようなら', 'ko': '안녕히 가세요', 'zh': '再见', 'ar': 'مع السلامة', 'ru': 'до свидания'
  },
  'yes': {
    'fr': 'oui', 'es': 'sí', 'de': 'ja', 'it': 'sì', 'pt': 'sim',
    'ja': 'はい', 'ko': '네', 'zh': '是', 'ar': 'نعم', 'ru': 'да'
  },
  'no': {
    'fr': 'non', 'es': 'no', 'de': 'nein', 'it': 'no', 'pt': 'não',
    'ja': 'いいえ', 'ko': '아니오', 'zh': '不', 'ar': 'لا', 'ru': 'нет'
  },
  'water': {
    'fr': 'eau', 'es': 'agua', 'de': 'wasser', 'it': 'acqua', 'pt': 'água',
    'ja': '水', 'ko': '물', 'zh': '水', 'ar': 'ماء', 'ru': 'вода'
  },
  'food': {
    'fr': 'nourriture', 'es': 'comida', 'de': 'essen', 'it': 'cibo', 'pt': 'comida',
    'ja': '食べ物', 'ko': '음식', 'zh': '食物', 'ar': 'طعام', 'ru': 'еда'
  },
  'house': {
    'fr': 'maison', 'es': 'casa', 'de': 'haus', 'it': 'casa', 'pt': 'casa',
    'ja': '家', 'ko': '집', 'zh': '房子', 'ar': 'منزل', 'ru': 'дом'
  },
  'car': {
    'fr': 'voiture', 'es': 'coche', 'de': 'auto', 'it': 'macchina', 'pt': 'carro',
    'ja': '車', 'ko': '자동차', 'zh': '汽车', 'ar': 'سيارة', 'ru': 'машина'
  },
  'love': {
    'fr': 'amour', 'es': 'amor', 'de': 'liebe', 'it': 'amore', 'pt': 'amor',
    'ja': '愛', 'ko': '사랑', 'zh': '爱', 'ar': 'حب', 'ru': 'любовь'
  },
  'friend': {
    'fr': 'ami', 'es': 'amigo', 'de': 'freund', 'it': 'amico', 'pt': 'amigo',
    'ja': '友達', 'ko': '친구', 'zh': '朋友', 'ar': 'صديق', 'ru': 'друг'
  },
  'free': {
    'fr': 'gratuit', 'es': 'gratis', 'de': 'kostenlos', 'it': 'gratuito', 'pt': 'grátis',
    'ja': '無料', 'ko': '무료', 'zh': '免费', 'ar': 'مجاني', 'ru': 'бесплатно'
  },
  // Spanish words
  'mujer': {
    'en': 'woman', 'fr': 'femme', 'de': 'frau', 'it': 'donna', 'pt': 'mulher'
  },
  'hombre': {
    'en': 'man', 'fr': 'homme', 'de': 'mann', 'it': 'uomo', 'pt': 'homem'
  },
  'hola': {
    'en': 'hello', 'fr': 'bonjour', 'de': 'hallo', 'it': 'ciao', 'pt': 'olá'
  },
  'gracias': {
    'en': 'thank you', 'fr': 'merci', 'de': 'danke', 'it': 'grazie', 'pt': 'obrigado'
  },
  'agua': {
    'en': 'water', 'fr': 'eau', 'de': 'wasser', 'it': 'acqua', 'pt': 'água'
  },
  'casa': {
    'en': 'house', 'fr': 'maison', 'de': 'haus', 'it': 'casa', 'pt': 'casa'
  },
  'amor': {
    'en': 'love', 'fr': 'amour', 'de': 'liebe', 'it': 'amore', 'pt': 'amor'
  },
  'gratis': {
    'en': 'free', 'fr': 'gratuit', 'de': 'kostenlos', 'it': 'gratuito', 'pt': 'grátis'
  },
  // French words
  'femme': {
    'en': 'woman', 'es': 'mujer', 'de': 'frau', 'it': 'donna', 'pt': 'mulher'
  },
  'homme': {
    'en': 'man', 'es': 'hombre', 'de': 'mann', 'it': 'uomo', 'pt': 'homem'
  },
  'bonjour': {
    'en': 'hello', 'es': 'hola', 'de': 'hallo', 'it': 'ciao', 'pt': 'olá'
  },
  'merci': {
    'en': 'thank you', 'es': 'gracias', 'de': 'danke', 'it': 'grazie', 'pt': 'obrigado'
  },
  'gratuit': {
    'en': 'free', 'es': 'gratis', 'de': 'kostenlos', 'it': 'gratuito', 'pt': 'grátis'
  }
};

const mockTranslate = (text: string, to: string): string => {
  const lowerText = text.toLowerCase().trim();
  
  // Check if we have a direct translation
  if (translationDatabase[lowerText] && translationDatabase[lowerText][to]) {
    return translationDatabase[lowerText][to];
  }
  
  // For phrases, try to translate word by word
  if (lowerText.includes(' ')) {
    const words = lowerText.split(' ');
    const translatedWords = words.map(word => {
      if (translationDatabase[word] && translationDatabase[word][to]) {
        return translationDatabase[word][to];
      }
      return word;
    });
    
    // If we translated any words, return the result
    if (translatedWords.some((word, index) => word !== words[index])) {
      return translatedWords.join(' ');
    }
  }
  
  // Return original text if no translation found
  return text;
};

// Simple translation using MyMemory API with HTML stripping
async function tryMyMemoryTranslation(text: string, from: string, to: string): Promise<string | null> {
  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    if (response.ok) {
      const data = await response.json();
      if (data.responseStatus === 200) {
        // Strip HTML tags from the response
        const translatedText = stripHtmlTags(data.responseData.translatedText);
        return translatedText;
      }
    }
    return null;
  } catch (error) {
    console.log('MyMemory API failed:', error);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const { text, to, from = 'auto' } = await request.json();
    
    console.log('Translation request:', { text, from, to });
    
    if (!text || !to) {
      return NextResponse.json(
        { error: 'Missing text or target language' },
        { status: 400 }
      );
    }

    let translatedText = '';
    let usedExternalAPI = false;

    // Try MyMemory API first
    console.log('Trying MyMemory API...');
    const myMemoryResult = await tryMyMemoryTranslation(text, from, to);
    
    if (myMemoryResult) {
      translatedText = myMemoryResult;
      usedExternalAPI = true;
      console.log('MyMemory API success (cleaned):', translatedText);
    } else {
      // If MyMemory fails, use our improved mock translation
      console.log('MyMemory API failed, using mock translation');
      translatedText = mockTranslate(text, to);
    }

    // Ensure no HTML tags remain
    translatedText = stripHtmlTags(translatedText);

    // Return in the expected format
    const formattedResponse = [
      {
        translations: [
          {
            text: translatedText,
            to: to
          }
        ]
      }
    ];

    return NextResponse.json(formattedResponse);
    
  } catch (error) {
    console.error('Translation error:', error);
    
    // Final fallback with HTML stripping
    const { text, to } = await request.json();
    let translatedText = mockTranslate(text, to);
    translatedText = stripHtmlTags(translatedText);
    
    return NextResponse.json([
      {
        translations: [{ text: translatedText, to }]
      }
    ]);
  }
}