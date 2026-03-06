// QUESTIONS DATABASE - NS4 QUIZ

const NS4_QUESTIONS = {

  mathematics: {
    levels: {
      niveau1: {
        questions: [
          {
            q: "Ki derive de f(x) = x²?",
            a: ["2x","x","x²","2"],
            correct: 0,
            type: "radio",
            explanation: "Derive de x² se 2x."
          },
          {
            q: "Ki entègral de ∫2x dx?",
            a: ["x² + C","2x + C","x + C","x²/2 + C"],
            correct: 0,
            type: "radio",
            explanation: "Entègral de 2x dx se x² + C."
          }
        ],

        exam: [
          {
            q: "Ki valè f'(x) si f(x)=3x³?",
            a: ["9x²","3x²","x³","6x²"],
            correct: 0,
            type: "radio"
          }
        ]
      }
    }
  },

  statistik: {
    levels: {
      niveau1: {
        questions: [
          {
            q: "Ki mwayèn seri 2, 4, 6, 8?",
            a: ["4","5","6","7"],
            correct: 1,
            type: "radio",
            explanation: "Mwayèn = (2+4+6+8)/4 = 5."
          }
        ],

        exam: [
          {
            q: "Ki medyàn seri 3, 1, 4, 2, 5?",
            a: ["2","3","4","5"],
            correct: 1,
            type: "radio"
          }
        ]
      }
    }
  },

  pwobab: {
    levels: {
      niveau1: {
        questions: [
          {
            q: "Si ou jete yon de, ki pwobabilite pou sòti 4?",
            a: ["1/6","1/2","1/4","1/3"],
            correct: 0,
            type: "radio",
            explanation: "Gen 6 fas, chak gen menm chans: 1/6."
          }
        ],

        exam: [
          {
            q: "Si ou jete yon pyès lajan de fwa, ki pwobabilite pou sòti 2 tèt?",
            a: ["1/2","1/3","1/4","1/6"],
            correct: 2,
            type: "radio"
          }
        ]
      }
    }
  },

  philosophie: {
    levels: {
      niveau1: {
        questions: [
          {
            q: "Ki sa filozofi ye?",
            a: ["Etid relijyon","Etid lanati","Amou pou sajès","Etid matematik"],
            correct: 2,
            type: "radio",
            explanation: "Filozofi se 'amou pou sajès'."
          }
        ],

        exam: [
          {
            q: "Ki filozòf ki di 'Mwen panse, donk mwen egziste'?",
            a: ["Platon","Descartes","Aristòt","Sòkrèt"],
            correct: 1,
            type: "radio"
          }
        ]
      }
    }
  },

  physiquecondensateur: {
    levels: {
      niveau1: {
        questions: [
          {
            q: "Ki fòmil pou kapasite kondansatè?",
            a: ["C=Q/V","V=IR","F=ma","E=mc²"],
            correct: 0,
            type: "radio",
            explanation: "C = Q/V kote Q se chaj."
          }
        ],

        exam: [
          {
            q: "Si C=2F, V=5V, ki valè Q?",
            a: ["10C","7C","5C","2C"],
            correct: 0,
            type: "radio"
          }
        ]
      }
    }
  }

};
