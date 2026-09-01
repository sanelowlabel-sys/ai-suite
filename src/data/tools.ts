import { ToolDefinition, SeoMetadata } from '../types';

export const TOOLS: ToolDefinition[] = [
  // ==========================================
  // AUDIO & MUSIC AI SUITE (20 tools)
  // ==========================================
  {
    id: 'ai-bio-generator',
    name: 'AI Bio Generator',
    slug: 'ai-bio-generator',
    category: 'Audio & Music',
    description: 'Generate high-impact artist, DJ, label, and producer biographies optimized for Spotify, press releases, festivals, and EPKs.',
    shortDescription: 'Artist & producer EPK bios for Spotify & press.',
    icon: 'UserCheck',
    badge: 'Popular',
    tags: ['Music', 'Bio', 'EPK', 'Spotify', 'Marketing'],
    popular: true,
    outputType: 'markdown',
    inputs: [
      { id: 'artistName', label: 'Artist or Band Name', type: 'text', placeholder: 'e.g., Nova Resonance', required: true },
      { id: 'genre', label: 'Primary Genre & Sub-genres', type: 'text', placeholder: 'e.g., Melodic Techno, Cyberpunk Synthwave', required: true },
      { id: 'influences', label: 'Key Influences & Sonic Style', type: 'textarea', placeholder: 'e.g., Tale of Us, Bicep, Daft Punk, dark basslines, ambient synthesizers' },
      { id: 'achievements', label: 'Key Milestones, Releases & Achievements', type: 'textarea', placeholder: 'e.g., 2M Spotify streams, featured on BBC Radio 1, performed at Awakenings' },
      { id: 'length', label: 'Bio Format Length', type: 'select', defaultValue: 'standard', options: [
        { label: 'Short Spotify Bio (150 words)', value: 'short' },
        { label: 'Standard Press Release Bio (350 words)', value: 'standard' },
        { label: 'Full EPK & Agency Bio (600 words)', value: 'full' },
        { label: 'Social Media One-Liner Hooks (5 variants)', value: 'hooks' }
      ]},
      { id: 'tone', label: 'Narrative Tone', type: 'select', defaultValue: 'captivating', options: [
        { label: 'Captivating & Cinematic', value: 'captivating' },
        { label: 'Underground & Mysterious', value: 'underground' },
        { label: 'Polished & Industry Professional', value: 'professional' },
        { label: 'Energetic & Punchy', value: 'energetic' }
      ]}
    ]
  },
  {
    id: 'royalty-calculator',
    name: 'Royalty Calculator',
    slug: 'royalty-calculator',
    category: 'Audio & Music',
    description: 'Calculate multi-platform music streaming royalties across Spotify, Apple Music, YouTube Music, Tidal, and Amazon Music with master & publishing splits.',
    shortDescription: 'Accurate streaming payouts & royalty split engine.',
    icon: 'Calculator',
    badge: 'Essential',
    tags: ['Royalties', 'Calculator', 'Streaming', 'Finance', 'Splits'],
    popular: true,
    outputType: 'calculator',
    inputs: [
      { id: 'spotifyStreams', label: 'Spotify Streams', type: 'number', defaultValue: 100000 },
      { id: 'appleStreams', label: 'Apple Music Streams', type: 'number', defaultValue: 40000 },
      { id: 'youtubeStreams', label: 'YouTube Music / Content ID Views', type: 'number', defaultValue: 80000 },
      { id: 'tidalStreams', label: 'Tidal Streams', type: 'number', defaultValue: 10000 },
      { id: 'amazonStreams', label: 'Amazon Music Streams', type: 'number', defaultValue: 25000 },
      { id: 'labelShare', label: 'Record Label Share (%)', type: 'slider', defaultValue: 20, min: 0, max: 100, step: 1 },
      { id: 'distributorFee', label: 'Distributor Cut (%)', type: 'slider', defaultValue: 0, min: 0, max: 30, step: 1 }
    ]
  },
  {
    id: 'ai-playlist-pitcher',
    name: 'AI Playlist Pitcher',
    slug: 'ai-playlist-pitcher',
    category: 'Audio & Music',
    description: 'Craft high-conversion editorial playlist pitches tailored for Spotify for Artists, Apple Music Editorial, and independent tastemakers.',
    shortDescription: 'Compelling Spotify for Artists editorial pitches.',
    icon: 'Radio',
    tags: ['Spotify', 'Pitching', 'Playlists', 'Marketing'],
    outputType: 'markdown',
    inputs: [
      { id: 'trackTitle', label: 'Track Title', type: 'text', placeholder: 'e.g., Neon Horizon', required: true },
      { id: 'genre', label: 'Genre & Mood Tags', type: 'text', placeholder: 'e.g., Deep House, Late Night Drive, Euphoric', required: true },
      { id: 'story', label: 'Song Concept & Backstory', type: 'textarea', placeholder: 'e.g., Written during a lockdown road trip, exploring analog synthesizers and vocal chops...', required: true },
      { id: 'targetPlaylists', label: 'Target Playlists / Editorial Hubs', type: 'text', placeholder: 'e.g., Mint, Night Rider, Electronic Rising' }
    ]
  },
  {
    id: 'ai-genre-checker',
    name: 'AI Genre Checker',
    slug: 'ai-genre-checker',
    category: 'Audio & Music',
    description: 'Analyze sonic characteristics, track metadata, and acoustic cues to pinpoint exact genre hierarchies, niche sub-genres, and algorithm playlist tags.',
    shortDescription: 'Detect micro-genres & algorithmic playlist tags.',
    icon: 'Activity',
    tags: ['Genre', 'Detection', 'Audio', 'Metadata'],
    outputType: 'analysis',
    inputs: [
      { id: 'trackDescription', label: 'Describe Track Elements & Instrumentation', type: 'textarea', placeholder: 'e.g., 128 BPM, 808 sub bass, pitched vocal samples, Roland Juno chords, sidechained pads', required: true },
      { id: 'tempo', label: 'BPM / Tempo', type: 'number', defaultValue: 124 },
      { id: 'similarArtists', label: 'Similar Artists or Reference Tracks', type: 'text', placeholder: 'e.g., Fred again.., Disclosure, Four Tet' }
    ]
  },
  {
    id: 'ai-key-detector',
    name: 'AI Key Detector',
    slug: 'ai-key-detector',
    category: 'Audio & Music',
    description: 'Identify musical keys, Camelot wheel codes, harmonic compatibility, and relative scales for harmonic DJ mixing and vocal tuning.',
    shortDescription: 'Detect musical key & Camelot code for harmonic mixing.',
    icon: 'Key',
    tags: ['Key', 'Camelot', 'DJ', 'Mixing', 'Harmonics'],
    outputType: 'analysis',
    inputs: [
      { id: 'chordNotes', label: 'Chord Progression or Note Cluster', type: 'text', placeholder: 'e.g., Am - F - C - G or A, C, E, G', required: true },
      { id: 'bassNote', label: 'Dominant Bass/Root Note (Optional)', type: 'text', placeholder: 'e.g., A' }
    ]
  },
  {
    id: 'ai-song-checker',
    name: 'AI Song Checker',
    slug: 'ai-song-checker',
    category: 'Audio & Music',
    description: 'Perform a comprehensive studio A&R critique assessing arrangement, dynamic structure, commercial viability, mixing balance, and hook retention.',
    shortDescription: 'Full A&R studio audit & commercial rating.',
    icon: 'ShieldCheck',
    badge: 'A&R Audit',
    tags: ['A&R', 'Feedback', 'Arrangement', 'Mix Audit'],
    popular: true,
    outputType: 'analysis',
    inputs: [
      { id: 'trackTitle', label: 'Song Title & Artist', type: 'text', placeholder: 'e.g., Midnight Escape - DJ Horizon', required: true },
      { id: 'structure', label: 'Arrangement Structure Breakdown', type: 'textarea', placeholder: 'e.g., Intro (0-15s) -> Verse 1 (15-45s) -> Build (45-60s) -> Drop/Chorus (60-90s)...', required: true },
      { id: 'mixConcerns', label: 'Known Concerns or Focus Areas', type: 'textarea', placeholder: 'e.g., Is the low-end too muddy? Does the bridge lose momentum?' }
    ]
  },
  {
    id: 'ai-voice-generator',
    name: 'AI Voice Generator',
    slug: 'ai-voice-generator',
    category: 'Audio & Music',
    description: 'Generate lifelike vocal performances, speech synthesis, producer drop tags, and podcast intros with custom studio timbre, pitch, and inflection.',
    shortDescription: 'Neural voice synthesizer & producer tag generator.',
    icon: 'Mic',
    badge: 'Interactive',
    tags: ['Voice', 'TTS', 'Vocals', 'Producer Drops', 'Speech'],
    popular: true,
    outputType: 'interactive',
    inputs: [
      { id: 'script', label: 'Voice Script or Producer Tag', type: 'textarea', placeholder: 'e.g., "AI Suite in the mix", "Welcome to the late night studio session."', required: true },
      { id: 'voiceStyle', label: 'Voice Character & Timbre', type: 'select', defaultValue: 'studio_male', options: [
        { label: 'Deep Studio Male (Radio/Drop)', value: 'studio_male' },
        { label: 'Smooth Ambient Female (Ethereal)', value: 'ambient_female' },
        { label: 'Energetic Hype Host (Festival)', value: 'hype_host' },
        { label: 'Cyberpunk Robotic Vocoder', value: 'cyber_vocoder' },
        { label: 'Warm Narrative Acoustic', value: 'warm_narrator' }
      ]},
      { id: 'pitch', label: 'Pitch Shift (Semitones)', type: 'slider', defaultValue: 0, min: -12, max: 12, step: 1 },
      { id: 'speed', label: 'Speed Multiplier', type: 'slider', defaultValue: 1.0, min: 0.5, max: 2.0, step: 0.1 },
      { id: 'reverb', label: 'Studio Reverb Space', type: 'select', defaultValue: 'plate', options: [
        { label: 'Dry Studio Booth', value: 'dry' },
        { label: 'Vintage Plate Reverb', value: 'plate' },
        { label: 'Cathedral Hall Reverb', value: 'cathedral' },
        { label: 'Cyber Slapback Echo', value: 'echo' }
      ]}
    ]
  },
  {
    id: 'ai-cover-generator',
    name: 'AI Cover Generator',
    slug: 'ai-cover-generator',
    category: 'Audio & Music',
    description: 'Design single artwork, album covers, vinyl mockups, and mixtape sleeves compliant with 3000x3000px Spotify and Apple Music distribution specs.',
    shortDescription: '3000x3000px release artwork & vinyl mockups.',
    icon: 'Disc',
    tags: ['Cover Art', 'Album', 'Design', 'Vinyl', 'Spotify'],
    outputType: 'interactive',
    inputs: [
      { id: 'albumTitle', label: 'Release / Album Title', type: 'text', placeholder: 'e.g., Midnight Odyssey', required: true },
      { id: 'artistName', label: 'Artist Name', type: 'text', placeholder: 'e.g., AI Horizon', required: true },
      { id: 'visualStyle', label: 'Aesthetic Direction', type: 'select', defaultValue: 'cyberpunk', options: [
        { label: 'Dark Cyberpunk & Neon Glow', value: 'cyberpunk' },
        { label: 'Minimalist Swiss Typography & Clean Grids', value: 'minimalist' },
        { label: 'Vintage 90s Vinyl & Grainy Film', value: 'vintage_vinyl' },
        { label: 'Psychedelic Surreal 3D Dreamscape', value: 'surreal_3d' },
        { label: 'Moody Ambient Monochrome Photography', value: 'monochrome' }
      ]},
      { id: 'customElements', label: 'Visual Elements & Symbolism', type: 'textarea', placeholder: 'e.g., Retro sports car in rain, geometric red logo, Japanese typography, film grain' }
    ]
  },
  {
    id: 'bots-detector',
    name: 'Bots Detector',
    slug: 'bots-detector',
    category: 'Audio & Music',
    description: 'Detect artificial stream farms, bot-manipulated playlists, suspicious listener-to-follower ratios, and protect Spotify distributor standing.',
    shortDescription: 'Audit playlists & protect against fake streams.',
    icon: 'Bot',
    badge: 'Security',
    tags: ['Security', 'Fraud', 'Spotify', 'Stream Farms', 'Analytics'],
    outputType: 'analysis',
    inputs: [
      { id: 'playlistUrl', label: 'Playlist / Artist Link or Title', type: 'text', placeholder: 'e.g., Top Hits 2026 / https://open.spotify.com/playlist/...', required: true },
      { id: 'followersCount', label: 'Total Playlist Followers', type: 'number', defaultValue: 45000 },
      { id: 'dailyStreams', label: 'Estimated Daily Streams Reported', type: 'number', defaultValue: 12000 },
      { id: 'topCities', label: 'Top Listener Cities', type: 'text', placeholder: 'e.g., Ashburn US, Buffalo US, Helsinki FI' }
    ]
  },
  {
    id: 'ai-chord-scaler',
    name: 'AI Chord Scaler',
    slug: 'ai-chord-scaler',
    category: 'Audio & Music',
    description: 'Transform, invert, and scale chord progressions across Dorian, Lydian, Mixolydian, Aeolian, and Neapolitan modes with Roman numeral theory.',
    shortDescription: 'Modal scale transpose & jazz chord extensions.',
    icon: 'Layers',
    tags: ['Chords', 'Theory', 'Scales', 'Modal', 'Inversions'],
    outputType: 'analysis',
    inputs: [
      { id: 'chords', label: 'Current Progression', type: 'text', placeholder: 'e.g., Cmaj7 - Am7 - Dm9 - G13', required: true },
      { id: 'targetMode', label: 'Target Mode / Scale', type: 'select', defaultValue: 'dorian', options: [
        { label: 'Dorian Mode (Sophisticated Neo-Soul)', value: 'dorian' },
        { label: 'Lydian Mode (Dreamy / Cinematic)', value: 'lydian' },
        { label: 'Mixolydian (Bluesy House Groove)', value: 'mixolydian' },
        { label: 'Phrygian Dominant (Dark Trap / Flamenco)', value: 'phrygian' },
        { label: 'Harmonic Minor (Emotional Melodic Techno)', value: 'harmonic_minor' }
      ]},
      { id: 'complexity', label: 'Voicing Complexity', type: 'select', defaultValue: 'extended', options: [
        { label: 'Triads (Simple 3-note)', value: 'triads' },
        { label: '7th Chords (Standard Studio)', value: 'sevenths' },
        { label: 'Extended 9th, 11th, 13th & Altered', value: 'extended' }
      ]}
    ]
  },
  {
    id: 'ai-auto-chords',
    name: 'AI Auto Chords',
    slug: 'ai-auto-chords',
    category: 'Audio & Music',
    description: 'Generate evocative chord progressions tailored for any mood, genre, tempo, and emotion with MIDI-compatible voice leading.',
    shortDescription: 'Instant emotional chord progressions & MIDI guide.',
    icon: 'Sliders',
    tags: ['Chords', 'Composition', 'Progression', 'MIDI'],
    outputType: 'markdown',
    inputs: [
      { id: 'genre', label: 'Target Genre', type: 'text', placeholder: 'e.g., R&B, Melodic Techno, Lo-Fi, Trap', required: true },
      { id: 'emotion', label: 'Emotional Atmosphere', type: 'select', defaultValue: 'nostalgic', options: [
        { label: 'Nostalgic & Bittersweet', value: 'nostalgic' },
        { label: 'Dark & Hypnotic', value: 'dark' },
        { label: 'Euphoric & Triumphant', value: 'euphoric' },
        { label: 'Melancholic & Introspective', value: 'melancholic' },
        { label: 'Lush & Romantic', value: 'lush' }
      ]},
      { id: 'rootKey', label: 'Root Key (Optional)', type: 'text', placeholder: 'e.g., F# Minor' }
    ]
  },
  {
    id: 'ai-music-mastering',
    name: 'AI Music Mastering',
    slug: 'ai-music-mastering',
    category: 'Audio & Music',
    description: 'Online AI audio mastering suite with real-time loudness metering (LUFS), multiband compression, stereo imaging, and harmonic excitation.',
    shortDescription: 'Stream-ready mastering engine with LUFS metering.',
    icon: 'Volume2',
    badge: 'Pro Studio',
    tags: ['Mastering', 'Audio', 'LUFS', 'Compression', 'EQ'],
    popular: true,
    outputType: 'interactive',
    inputs: [
      { id: 'targetLufs', label: 'Target Integrated Loudness', type: 'select', defaultValue: '-14', options: [
        { label: 'Streaming Standard (-14 LUFS - Spotify/Apple)', value: '-14' },
        { label: 'Club / DJ Master (-8 LUFS - High Energy Club)', value: '-8' },
        { label: 'CD / Dynamic Master (-11 LUFS - Audiophile)', value: '-11' },
        { label: 'Aggressive EDM / Bass (-6 LUFS - Heavy Limiting)', value: '-6' }
      ]},
      { id: 'masteringProfile', label: 'Mastering Profile Preset', type: 'select', defaultValue: 'warm_analog', options: [
        { label: 'Warm Analog Tape & Tube Warmth', value: 'warm_analog' },
        { label: 'Modern Crisp Air & Punchy Transient', value: 'modern_punch' },
        { label: 'Deep Sub Tight & Clean Bassline', value: 'club_sub' },
        { label: 'Wide Stereo Immersion & Spatializer', value: 'wide_spatial' }
      ]},
      { id: 'stereoWidth', label: 'Stereo Spread Expansion', type: 'slider', defaultValue: 120, min: 100, max: 200, step: 5 }
    ]
  },
  {
    id: 'ai-master-studio',
    name: 'AI Master Studio',
    slug: 'ai-master-studio',
    category: 'Audio & Music',
    description: 'Complete multi-chain mastering console with dynamic EQ, multiband transient shaper, saturation color, and spectral balance analysis.',
    shortDescription: 'Mastering console with spectral analysis & multi-band chain.',
    icon: 'Cpu',
    tags: ['Mastering', 'Studio', 'DSP', 'Audio Chain'],
    outputType: 'interactive',
    inputs: [
      { id: 'genreProfile', label: 'Mastering Style Profile', type: 'text', placeholder: 'e.g., Commercial Pop, Tech House, Cinematic Orchestra', required: true },
      { id: 'bassEnhance', label: 'Low-End Monofying & Tightening', type: 'toggle', defaultValue: true },
      { id: 'highAir', label: 'Air Band Harmonic Exciter (+12kHz)', type: 'toggle', defaultValue: true }
    ]
  },
  {
    id: 'ai-vocal-generator',
    name: 'AI Vocal Generator',
    slug: 'ai-vocal-generator',
    category: 'Audio & Music',
    description: 'Synthesize custom vocal hooks, melodic phrases, ad-libs, and harmony stacks with automated pitch correction and formant shifting.',
    shortDescription: 'Generate vocal hooks, harmonies & melodic ad-libs.',
    icon: 'Radio',
    tags: ['Vocals', 'Hooks', 'Singing', 'Formant', 'Auto-Tune'],
    outputType: 'interactive',
    inputs: [
      { id: 'lyrics', label: 'Lyrics / Hook Phrase', type: 'textarea', placeholder: 'e.g., "Lost in the rhythm of the neon lights..."', required: true },
      { id: 'vocalType', label: 'Vocal Archetype', type: 'select', defaultValue: 'pop_female', options: [
        { label: 'Pop Female (Crystal Clean & Autotuned)', value: 'pop_female' },
        { label: 'R&B Falsetto Male (Silky & Smooth)', value: 'rnb_male' },
        { label: 'Indie Folk Whispering Female', value: 'indie_female' },
        { label: 'Gospel Choir Harmony Stack', value: 'choir_stack' }
      ]},
      { id: 'formantShift', label: 'Formant Character', type: 'slider', defaultValue: 0, min: -6, max: 6, step: 1 }
    ]
  },
  {
    id: 'lyrics-generator',
    name: 'Lyrics Generator',
    slug: 'lyrics-generator',
    category: 'Audio & Music',
    description: 'Write chart-topping song lyrics, rhyme schemes, hook motifs, and verse-chorus-bridge structures across all modern music genres.',
    shortDescription: 'Structure complete lyrics with rhyme schemes & cadence.',
    icon: 'FileText',
    badge: 'Popular',
    tags: ['Lyrics', 'Songwriting', 'Rhymes', 'Composition'],
    popular: true,
    outputType: 'markdown',
    inputs: [
      { id: 'topic', label: 'Song Theme / Storyline', type: 'textarea', placeholder: 'e.g., Late night racing in Tokyo, heartbreak in a digital age, breaking free from routine...', required: true },
      { id: 'genre', label: 'Music Genre', type: 'select', defaultValue: 'hiphop', options: [
        { label: 'Hip Hop / Trap (Complex Rhymes & Flow Schemes)', value: 'hiphop' },
        { label: 'Pop / Synthpop (Catchy Earworm Chorus)', value: 'pop' },
        { label: 'R&B / Soul (Emotional Metaphors & Vulnerability)', value: 'rnb' },
        { label: 'Indie Rock / Alternative (Poetic & Imagery-Driven)', value: 'indie' },
        { label: 'Afrobeats / Dancehall (Uplifting & Melodic Vibes)', value: 'afrobeats' }
      ]},
      { id: 'mood', label: 'Mood / Energy', type: 'text', placeholder: 'e.g., High Energy, Melancholic, Chill, Aggressive' }
    ]
  },
  {
    id: 'ai-music-studio',
    name: 'AI Music Studio',
    slug: 'ai-music-studio',
    category: 'Audio & Music',
    description: 'Full-featured online digital audio workstation (DAW) sketchpad with interactive synthesizer, step sequencer, drum pads, and real-time audio playback.',
    shortDescription: 'Interactive synth, drum sequencer & DAW sketchpad.',
    icon: 'Headphones',
    badge: 'DAW Sandbox',
    tags: ['DAW', 'Synthesizer', 'Drums', 'Sequencer', 'Studio'],
    popular: true,
    outputType: 'interactive',
    inputs: [
      { id: 'tempo', label: 'Project BPM', type: 'number', defaultValue: 126, min: 60, max: 190 },
      { id: 'scale', label: 'Root Scale', type: 'select', defaultValue: 'f_minor', options: [
        { label: 'F Minor (Deep & Atmospheric)', value: 'f_minor' },
        { label: 'A Minor (Universal Classic)', value: 'a_minor' },
        { label: 'C Major (Bright & Uplifting)', value: 'c_major' },
        { label: 'D Minor (Driving Melodic)', value: 'd_minor' }
      ]}
    ]
  },
  {
    id: 'ai-stem-separation',
    name: 'AI Stem Separation',
    slug: 'ai-stem-separation',
    category: 'Audio & Music',
    description: 'Separate full audio mixes into isolated multi-track stems: Vocals, Drums, Bassline, and Instruments with individual track volume and solo controls.',
    shortDescription: 'Isolate Vocals, Drums, Bass, and Melody stems.',
    icon: 'Grid',
    badge: 'Interactive',
    tags: ['Stems', 'Vocals', 'Drums', 'Bass', 'Remixing'],
    popular: true,
    outputType: 'interactive',
    inputs: [
      { id: 'separationMode', label: 'Stem Extraction Model', type: 'select', defaultValue: '4stems', options: [
        { label: '4-Stems: Vocals + Drums + Bass + Instruments', value: '4stems' },
        { label: '2-Stems: Acapella + Instrumental (Karaoke)', value: '2stems' },
        { label: 'Drums Demix: Kick + Snare + Hi-Hats + Percs', value: 'drums' }
      ]}
    ]
  },
  {
    id: 'ai-song-identify',
    name: 'AI Song Identify',
    slug: 'ai-song-identify',
    category: 'Audio & Music',
    description: 'Identify unknown song recordings, extract detailed ISRC codes, BPM, musical key, release date, artist credits, and publishing metadata.',
    shortDescription: 'Identify tracks, BPM, key, and metadata tags.',
    icon: 'Search',
    tags: ['Shazam', 'Identify', 'ISRC', 'BPM', 'Metadata'],
    outputType: 'analysis',
    inputs: [
      { id: 'audioClues', label: 'Lyrics Snippet, Melody Description, or Audio Info', type: 'textarea', placeholder: 'e.g., Lyrics go "I feel the rush in my veins tonight", upbeat synthwave, female vocal, released around 2024', required: true }
    ]
  },
  {
    id: 'text-to-speech',
    name: 'Text To Speech',
    slug: 'text-to-speech',
    category: 'Audio & Music',
    description: 'Transform written text into natural, expressive human-like spoken audio with adjustable speech rate, voice accents, and instant MP3 export.',
    shortDescription: 'High-fidelity natural neural speech synthesis.',
    icon: 'VolumeX',
    tags: ['TTS', 'Speech', 'Voiceover', 'Narration'],
    outputType: 'interactive',
    inputs: [
      { id: 'text', label: 'Text to Synthesize', type: 'textarea', placeholder: 'Enter any text, article, script, or dialogue to speak...', required: true },
      { id: 'voiceName', label: 'Voice Profile', type: 'select', defaultValue: 'en_us_neutral', options: [
        { label: 'English (US) - Professional Narrator', value: 'en_us_neutral' },
        { label: 'English (UK) - Deep Documentary Style', value: 'en_uk_doc' },
        { label: 'English (US) - Warm Conversational Female', value: 'en_us_female' },
        { label: 'English (US) - Fast Tech Explainer', value: 'en_us_fast' }
      ]},
      { id: 'rate', label: 'Speech Rate (Speed)', type: 'slider', defaultValue: 1.0, min: 0.5, max: 2.0, step: 0.1 }
    ]
  },
  {
    id: 'speech-to-text',
    name: 'Speech To Text',
    slug: 'speech-to-text',
    category: 'Audio & Music',
    description: 'Transcribe spoken audio, voice notes, lyric recordings, and studio brainstorming into accurate timestamped text transcripts.',
    shortDescription: 'Live audio transcription & lyric-to-text conversion.',
    icon: 'MicOff',
    tags: ['STT', 'Transcribe', 'Audio to Text', 'Voice Memo'],
    outputType: 'interactive',
    inputs: [
      { id: 'language', label: 'Spoken Language', type: 'select', defaultValue: 'en', options: [
        { label: 'English (Auto-Detect Accents)', value: 'en' },
        { label: 'Spanish (Español)', value: 'es' },
        { label: 'French (Français)', value: 'fr' },
        { label: 'German (Deutsch)', value: 'de' },
        { label: 'Japanese (日本語)', value: 'ja' }
      ]}
    ]
  },

  // ==========================================
  // MARKETING, WRITING & COPYWRITING AI SUITE (9 tools)
  // ==========================================
  {
    id: 'ai-name-generator',
    name: 'AI Name Generator',
    slug: 'ai-name-generator',
    category: 'Marketing & Writing',
    description: 'Generate catchy, brandable, trademark-friendly names for record labels, artist aliases, podcasts, brands, and creative ventures.',
    shortDescription: 'Brandable names for artist aliases & record labels.',
    icon: 'Sparkles',
    badge: 'Popular',
    tags: ['Branding', 'Names', 'Artist Alias', 'Labels'],
    outputType: 'markdown',
    inputs: [
      { id: 'vibe', label: 'Core Theme, Keywords & Aesthetic', type: 'textarea', placeholder: 'e.g., Futuristic electronic music, minimalism, dark nocturnal atmosphere, high energy', required: true },
      { id: 'type', label: 'Name Category', type: 'select', defaultValue: 'artist', options: [
        { label: 'DJ / Producer / Artist Alias', value: 'artist' },
        { label: 'Record Label / Media Studio', value: 'label' },
        { label: 'Song / Album / EP Title', value: 'release' },
        { label: 'Podcast / Show Series Title', value: 'podcast' },
        { label: 'SaaS / Brand / Tech Project', value: 'tech' }
      ]}
    ]
  },
  {
    id: 'ai-email-copywriting',
    name: 'AI Email Copywriting',
    slug: 'ai-email-copywriting',
    category: 'Marketing & Writing',
    description: 'Generate high-open-rate cold pitches, booking requests, newsletter releases, promoter outreach, and PR blast campaigns.',
    shortDescription: 'Booking emails, press releases & promoter outreach.',
    icon: 'Mail',
    tags: ['Email', 'Outreach', 'Booking', 'PR', 'Marketing'],
    outputType: 'markdown',
    inputs: [
      { id: 'recipient', label: 'Recipient Profile / Goal', type: 'select', defaultValue: 'booking', options: [
        { label: 'Festival / Club Booking Agent (Gig Pitch)', value: 'booking' },
        { label: 'Music Blog / PR Journalist (Press Release)', value: 'press' },
        { label: 'Brand Sponsor / Partnership Proposal', value: 'sponsor' },
        { label: 'Fan Newsletter / Album Announcement', value: 'newsletter' }
      ]},
      { id: 'details', label: 'Key Details & Pitch Information', type: 'textarea', placeholder: 'e.g., Launching single on March 15th, 100k Spotify monthly listeners, touring EU in summer...', required: true }
    ]
  },
  {
    id: 'ai-blog-generator',
    name: 'AI Blog Generator',
    slug: 'ai-blog-generator',
    category: 'Marketing & Writing',
    description: 'Create comprehensive, SEO-optimized music journalism articles, studio equipment reviews, tutorial write-ups, and industry thought leadership.',
    shortDescription: 'Full-length SEO articles & music journalism.',
    icon: 'Edit3',
    tags: ['Blog', 'SEO', 'Articles', 'Journalism', 'Content'],
    outputType: 'markdown',
    inputs: [
      { id: 'topic', label: 'Article Topic or Headline', type: 'text', placeholder: 'e.g., The Evolution of Analog Synthesizers in Modern Electronic Music', required: true },
      { id: 'keywords', label: 'Target SEO Keywords', type: 'text', placeholder: 'e.g., analog synth, sound design, Roland Juno, music production' },
      { id: 'tone', label: 'Writing Style', type: 'select', defaultValue: 'expert', options: [
        { label: 'Authoritative & Expert Studio Guide', value: 'expert' },
        { label: 'Engaging & Casual Magazine Style', value: 'casual' },
        { label: 'Deep Technical Analysis', value: 'technical' }
      ]}
    ]
  },
  {
    id: 'ai-meta-generator',
    name: 'AI Meta Generator',
    slug: 'ai-meta-generator',
    category: 'Marketing & Writing',
    description: 'Generate high-CTR SEO meta titles, meta descriptions, Open Graph social share tags, and Twitter Cards optimized for Google indexing.',
    shortDescription: 'SEO titles, meta descriptions & Open Graph tags.',
    icon: 'Code',
    tags: ['SEO', 'Meta', 'Open Graph', 'Google CTR'],
    outputType: 'markdown',
    inputs: [
      { id: 'pageTitle', label: 'Page / Product / Song Name', type: 'text', placeholder: 'e.g., AI Suite - Complete Music AI Tools', required: true },
      { id: 'pageSummary', label: 'Page Summary & Value Proposition', type: 'textarea', placeholder: 'e.g., A collection of 54 AI tools for music producers, audio engineers, and digital creators.', required: true }
    ]
  },
  {
    id: 'post-scheduling',
    name: 'Post Scheduling',
    slug: 'post-scheduling',
    category: 'Marketing & Writing',
    description: 'Plan, schedule, and optimize an entire 30-day music release social media rollout across TikTok, Instagram Reels, X/Twitter, and YouTube Shorts.',
    shortDescription: '30-day release rollout calendar for TikTok & IG.',
    icon: 'Calendar',
    tags: ['Social Media', 'Scheduling', 'TikTok', 'Instagram', 'Rollout'],
    outputType: 'markdown',
    inputs: [
      { id: 'releaseDate', label: 'Release Date & Track Name', type: 'text', placeholder: 'e.g., "Solar Echoes" dropping October 20th', required: true },
      { id: 'contentPillars', label: 'Available Content Assets', type: 'textarea', placeholder: 'e.g., Behind-the-scenes studio clips, teaser visualizer, remix contest, artist Q&A', required: true }
    ]
  },
  {
    id: 'ai-paraphrase',
    name: 'AI Paraphrase',
    slug: 'ai-paraphrase',
    category: 'Marketing & Writing',
    description: 'Rewrite and polish existing text into 5 distinct tonal variations while preserving core meaning and enhancing clarity and impact.',
    shortDescription: 'Rewrite text into multiple tones & punchy variations.',
    icon: 'Repeat',
    tags: ['Paraphrase', 'Rewriter', 'Clarity', 'Grammar'],
    outputType: 'markdown',
    inputs: [
      { id: 'inputText', label: 'Original Text to Rewrite', type: 'textarea', placeholder: 'Paste any paragraph, email draft, or bio here...', required: true },
      { id: 'goal', label: 'Rewrite Goal', type: 'select', defaultValue: 'all', options: [
        { label: 'Generate 5 Multi-Tone Variants (Formal, Punchy, Creative, etc.)', value: 'all' },
        { label: 'Make It Punchy & Concise (Shorten)', value: 'concise' },
        { label: 'Elevate Vocabulary (Sophisticated)', value: 'sophisticated' }
      ]}
    ]
  },
  {
    id: 'ai-smart-writer',
    name: 'AI Smart Writer',
    slug: 'ai-smart-writer',
    category: 'Marketing & Writing',
    description: 'Multi-purpose AI assistant capable of drafting long-form essays, contracts, press releases, video scripts, and creative narratives with high coherence.',
    shortDescription: 'Advanced general studio writing & drafting engine.',
    icon: 'PenTool',
    badge: 'Pro',
    tags: ['Writing', 'Drafting', 'Scripts', 'Essays'],
    popular: true,
    outputType: 'markdown',
    inputs: [
      { id: 'prompt', label: 'What do you want to write?', type: 'textarea', placeholder: 'Describe your document, script, or narrative in detail...', required: true },
      { id: 'format', label: 'Output Document Format', type: 'select', defaultValue: 'article', options: [
        { label: 'Structured Article with Headings', value: 'article' },
        { label: 'YouTube / Video Voiceover Script with Visual Cues', value: 'script' },
        { label: 'Standard Agreement / Terms Draft', value: 'agreement' },
        { label: 'Creative Fiction / Worldbuilding Lore', value: 'lore' }
      ]}
    ]
  },
  {
    id: 'ai-social-listening',
    name: 'AI Social Listening Tool',
    slug: 'ai-social-listening',
    category: 'Marketing & Writing',
    description: 'Monitor audience sentiment, identify trending hashtags, detect viral sound waves, and extract audience insights across social networks.',
    shortDescription: 'Analyze social sentiment, viral trends & hashtag reach.',
    icon: 'Eye',
    tags: ['Listening', 'Sentiment', 'TikTok', 'Analytics', 'Trends'],
    outputType: 'analysis',
    inputs: [
      { id: 'topic', label: 'Brand, Artist, Track Name or Niche', type: 'text', placeholder: 'e.g., Melodic Techno on TikTok, #SynthTok, AI Suite', required: true },
      { id: 'context', label: 'Recent Posts / User Comments to Analyze', type: 'textarea', placeholder: 'Paste user comments, tweets, or describe the audience reaction...' }
    ]
  },
  {
    id: 'ai-translation-tool',
    name: 'AI Translation Tool',
    slug: 'ai-translation-tool',
    category: 'Marketing & Writing',
    description: 'Context-aware multilingual translation preserving artistic idioms, slang, lyrical rhythm, and industry-specific terminology.',
    shortDescription: 'Idiomatic multilingual translation for lyrics & copy.',
    icon: 'Globe',
    tags: ['Translation', 'Languages', 'Localization', 'Multilingual'],
    outputType: 'markdown',
    inputs: [
      { id: 'text', label: 'Text to Translate', type: 'textarea', placeholder: 'Enter text, lyrics, or marketing copy...', required: true },
      { id: 'targetLang', label: 'Target Language', type: 'select', defaultValue: 'es', options: [
        { label: 'Spanish (Español)', value: 'es' },
        { label: 'German (Deutsch)', value: 'de' },
        { label: 'French (Français)', value: 'fr' },
        { label: 'Japanese (日本語)', value: 'ja' },
        { label: 'Portuguese (Português)', value: 'pt' },
        { label: 'Italian (Italiano)', value: 'it' }
      ]}
    ]
  },

  // ==========================================
  // IMAGE & VISUAL AI SUITE (9 tools)
  // ==========================================
  {
    id: 'ai-logo-generator',
    name: 'AI Logo Generator',
    slug: 'ai-logo-generator',
    category: 'Image & Visual',
    description: 'Generate minimalist, vector-styled brand marks, typography logos, and icon emblems for record labels, fashion brands, and music collectives.',
    shortDescription: 'Minimalist vector logos for labels & artists.',
    icon: 'Hexagon',
    badge: 'Interactive',
    tags: ['Logo', 'Branding', 'Vector', 'Identity', 'Visual'],
    popular: true,
    outputType: 'interactive',
    inputs: [
      { id: 'brandName', label: 'Brand / Label Name', type: 'text', placeholder: 'e.g., AI Horizon Records', required: true },
      { id: 'style', label: 'Design Archetype', type: 'select', defaultValue: 'geometric', options: [
        { label: 'Geometric Minimalist (Swiss Bauhaus)', value: 'geometric' },
        { label: 'Dark Cyberpunk Monogram with Neon Accent', value: 'cyberpunk' },
        { label: 'Vintage Analog Badge & Stamp', value: 'vintage' },
        { label: 'Organic Waveform Abstract Symbol', value: 'waveform' }
      ]},
      { id: 'symbolIdea', label: 'Desired Symbol / Motif', type: 'text', placeholder: 'e.g., Soundwave triangle, abstract vinyl disc, letter S motif' }
    ]
  },
  {
    id: 'ai-visualizer',
    name: 'AI Visualizer',
    slug: 'ai-visualizer',
    category: 'Image & Visual',
    description: 'Generate real-time animated frequency visualizers, audio spectrum ripples, dynamic particle canvases, and exportable music reactive graphics.',
    shortDescription: 'Real-time audio spectrum & particle visualizer.',
    icon: 'PieChart',
    badge: 'Canvas FX',
    tags: ['Visualizer', 'Audio Spectrum', 'Canvas', 'Particles'],
    popular: true,
    outputType: 'interactive',
    inputs: [
      { id: 'theme', label: 'Visualizer Theme', type: 'select', defaultValue: 'sane_spectrum', options: [
        { label: 'Studio Neon Red Spectrum', value: 'sane_spectrum' },
        { label: 'Cyber Grid Circular Wave', value: 'cyber_grid' },
        { label: 'Deep Space Particle Nebula', value: 'particle_nebula' },
        { label: 'Analog Oscilloscope Sine Wave', value: 'oscilloscope' }
      ]}
    ]
  },
  {
    id: 'ai-image-enhancer',
    name: 'AI Image Enhancer',
    slug: 'ai-image-enhancer',
    category: 'Image & Visual',
    description: 'Enhance image fidelity, restore low-light press photos, balance contrast, and apply studio HDR color grading with canvas filters.',
    shortDescription: 'Studio HDR color grading & image clarity booster.',
    icon: 'Maximize',
    tags: ['Enhance', 'HDR', 'Color Grading', 'Contrast', 'Photos'],
    outputType: 'interactive',
    inputs: [
      { id: 'exposure', label: 'Exposure & Brightness', type: 'slider', defaultValue: 105, min: 50, max: 150, step: 1 },
      { id: 'contrast', label: 'Studio Contrast', type: 'slider', defaultValue: 115, min: 50, max: 200, step: 1 },
      { id: 'saturate', label: 'Vibrancy / Saturation', type: 'slider', defaultValue: 120, min: 0, max: 200, step: 1 },
      { id: 'sharpness', label: 'Detail Sharpness', type: 'slider', defaultValue: 110, min: 50, max: 200, step: 1 }
    ]
  },
  {
    id: 'ai-image-enlarger',
    name: 'AI Image Enlarger',
    slug: 'ai-image-enlarger',
    category: 'Image & Visual',
    description: 'Upscale low-resolution press photos and album artwork up to 400% (4x) with edge-preserving bicubic and super-resolution simulation.',
    shortDescription: 'Upscale images up to 4x with crisp edges.',
    icon: 'ZoomIn',
    tags: ['Upscale', 'Enlarge', 'High-Res', '4x'],
    outputType: 'interactive',
    inputs: [
      { id: 'scaleFactor', label: 'Upscale Scale Factor', type: 'select', defaultValue: '2x', options: [
        { label: '2x Resolution (Double Dimensions)', value: '2x' },
        { label: '4x Ultra Resolution (Quadruple)', value: '4x' }
      ]}
    ]
  },
  {
    id: 'ai-crop-image',
    name: 'AI Crop Image',
    slug: 'ai-crop-image',
    category: 'Image & Visual',
    description: 'Crop and frame images to exact social media aspect ratios: Spotify Cover (1:1), YouTube Banner (16:9), Instagram Story (9:16), and X Banner (3:1).',
    shortDescription: 'Crop to Spotify, IG Story, YouTube & X presets.',
    icon: 'Crop',
    badge: 'Interactive',
    tags: ['Crop', 'Resize', 'Aspect Ratio', 'Spotify', 'Instagram'],
    outputType: 'interactive',
    inputs: [
      { id: 'aspectRatio', label: 'Target Platform Ratio', type: 'select', defaultValue: '1:1', options: [
        { label: '1:1 Square (Spotify Cover / Instagram Post)', value: '1:1' },
        { label: '9:16 Portrait (TikTok / IG Reels / YouTube Shorts)', value: '9:16' },
        { label: '16:9 Landscape (YouTube Thumbnail / Video Header)', value: '16:9' },
        { label: '3:1 Banner (Twitter / X Header Banner)', value: '3:1' },
        { label: '4:5 Portrait (Instagram Feed Portrait)', value: '4:5' }
      ]}
    ]
  },
  {
    id: 'ai-color-picker',
    name: 'AI Color Picker',
    slug: 'ai-color-picker',
    category: 'Image & Visual',
    description: 'Extract harmonious studio color palettes, hex codes, HSL values, and dominant album tones with contrast ratio testing.',
    shortDescription: 'Extract HEX/RGB palettes & check contrast ratios.',
    icon: 'Droplet',
    badge: 'Palette Tool',
    tags: ['Color', 'Palette', 'HEX', 'RGB', 'Design System'],
    outputType: 'interactive',
    inputs: [
      { id: 'baseColor', label: 'Base Studio Color (Hex code or pick)', type: 'text', defaultValue: '#BE1E2F' },
      { id: 'harmonyMode', label: 'Palette Harmony', type: 'select', defaultValue: 'complementary', options: [
        { label: 'Complementary High Contrast', value: 'complementary' },
        { label: 'Analogous Studio Blend', value: 'analogous' },
        { label: 'Monochromatic Dark Mode Shading', value: 'monochromatic' },
        { label: 'Triadic Creative Vibrant', value: 'triadic' }
      ]}
    ]
  },
  {
    id: 'ai-image-compressor',
    name: 'AI Image Compressor',
    slug: 'ai-image-compressor',
    category: 'Image & Visual',
    description: 'Compress PNG, JPG, and WebP images up to 80% file size reduction without perceptible loss in visual fidelity for fast web loading.',
    shortDescription: 'Compress PNG/JPG/WebP with up to 80% size savings.',
    icon: 'Minimize2',
    tags: ['Compress', 'Optimize', 'JPG', 'PNG', 'WebP'],
    outputType: 'interactive',
    inputs: [
      { id: 'quality', label: 'Compression Quality Level', type: 'slider', defaultValue: 75, min: 20, max: 95, step: 5 },
      { id: 'outputFormat', label: 'Convert Format During Compression', type: 'select', defaultValue: 'original', options: [
        { label: 'Keep Original Format', value: 'original' },
        { label: 'Convert to Modern WebP (Recommended)', value: 'webp' },
        { label: 'Convert to JPEG', value: 'jpeg' }
      ]}
    ]
  },
  {
    id: 'ai-image-resizer',
    name: 'AI Image Resizer',
    slug: 'ai-image-resizer',
    category: 'Image & Visual',
    description: 'Resize image dimensions to precise pixel widths and heights with aspect ratio locking and high-quality canvas resampling.',
    shortDescription: 'Resize image dimensions with aspect ratio lock.',
    icon: 'Move',
    tags: ['Resize', 'Scale', 'Dimensions', 'Canvas'],
    outputType: 'interactive',
    inputs: [
      { id: 'targetWidth', label: 'Target Width (px)', type: 'number', defaultValue: 1200 },
      { id: 'targetHeight', label: 'Target Height (px)', type: 'number', defaultValue: 1200 },
      { id: 'maintainRatio', label: 'Maintain Aspect Ratio', type: 'toggle', defaultValue: true }
    ]
  },
  {
    id: 'collage-maker',
    name: 'Collage Maker',
    slug: 'collage-maker',
    category: 'Image & Visual',
    description: 'Assemble multi-photo festival recaps, EPK artist grids, and release promo collages with customizable borders and studio branding.',
    shortDescription: 'Build multi-photo EPK collages & festival recaps.',
    icon: 'Layout',
    tags: ['Collage', 'Grid', 'Photos', 'EPK', 'Social'],
    outputType: 'interactive',
    inputs: [
      { id: 'layoutType', label: 'Grid Layout Preset', type: 'select', defaultValue: 'grid_4', options: [
        { label: '2x2 Quad Grid (4 Photos)', value: 'grid_4' },
        { label: '1 Main Hero + 2 Side Panels (3 Photos)', value: 'hero_3' },
        { label: '3-Column Panoramic Split', value: 'col_3' },
        { label: 'Polaroid Style with Border Gaps', value: 'polaroid' }
      ]},
      { id: 'spacing', label: 'Border Gap Padding (px)', type: 'slider', defaultValue: 8, min: 0, max: 24, step: 2 }
    ]
  },

  // ==========================================
  // PDF & DOCUMENT PROCESSING SUITE (4 tools)
  // ==========================================
  {
    id: 'ai-pdf-split-merge',
    name: 'AI PDF Split & Merge',
    slug: 'ai-pdf-split-merge',
    category: 'PDF & Documents',
    description: 'Split large contracts and royalty statements into individual pages, or merge multiple music agreements into a single consolidated PDF.',
    shortDescription: 'Split or merge multi-page contracts & statements.',
    icon: 'FileCode',
    tags: ['PDF', 'Split', 'Merge', 'Contracts', 'Documents'],
    outputType: 'interactive',
    inputs: [
      { id: 'operation', label: 'Operation', type: 'select', defaultValue: 'merge', options: [
        { label: 'Merge Multiple Documents into One PDF', value: 'merge' },
        { label: 'Split Selected Page Ranges from PDF', value: 'split' }
      ]}
    ]
  },
  {
    id: 'ai-pdf-compressor',
    name: 'AI PDF Compressor',
    slug: 'ai-pdf-compressor',
    category: 'PDF & Documents',
    description: 'Reduce PDF file sizes for email delivery while preserving text clarity and embedded graphics.',
    shortDescription: 'Shrink PDF file size for email attachments.',
    icon: 'FileCheck',
    tags: ['PDF', 'Compress', 'Shrink', 'Email'],
    outputType: 'interactive',
    inputs: [
      { id: 'compressionLevel', label: 'Compression Strength', type: 'select', defaultValue: 'medium', options: [
        { label: 'Standard (Ideal for Email Attachments - 50% Reduction)', value: 'medium' },
        { label: 'Aggressive (Maximum Compression - 75% Reduction)', value: 'high' },
        { label: 'Light (Retains Ultra High Print Quality)', value: 'low' }
      ]}
    ]
  },
  {
    id: 'ai-pdf-to-word',
    name: 'AI PDF To Word Converter',
    slug: 'ai-pdf-to-word',
    category: 'PDF & Documents',
    description: 'Extract formatted text, tables, clause numbers, and signature lines from PDF contracts into editable documents.',
    shortDescription: 'Convert PDF contracts to editable documents.',
    icon: 'FileText',
    tags: ['PDF', 'Word', 'DOCX', 'Contract', 'Edit'],
    outputType: 'interactive',
    inputs: [
      { id: 'extractTables', label: 'Preserve Contract Split Sheets / Tables', type: 'toggle', defaultValue: true }
    ]
  },
  {
    id: 'ai-pdf-ocr',
    name: 'AI OCR PDF Extractor',
    slug: 'ai-pdf-ocr',
    category: 'PDF & Documents',
    description: 'Optical Character Recognition (OCR) engine that scans image-based PDFs, royalty invoices, and paper contracts into clean machine-readable text.',
    shortDescription: 'Optical OCR extraction from scanned invoices.',
    icon: 'Scan',
    tags: ['OCR', 'Scan', 'PDF', 'Invoices', 'Text Extraction'],
    outputType: 'interactive',
    inputs: [
      { id: 'sampleText', label: 'Input Scanned Document Text / OCR Paste', type: 'textarea', placeholder: 'Paste or upload scanned invoice data for intelligent cleanup and parsing...' }
    ]
  },

  // ==========================================
  // MEDIA CONVERTERS ENGINE (1 tool)
  // ==========================================
  {
    id: 'ai-file-converter',
    name: 'AI File Convertors',
    slug: 'ai-file-converter',
    category: 'Media Converters',
    description: 'Dynamic studio media conversion engine supporting MP3 to WAV, WAV to MP3, MOV to MP4, PNG to JPG, WebP, FLAC, and document formats.',
    shortDescription: 'Universal media converter: MP3, WAV, MP4, PNG, JPG, etc.',
    icon: 'RefreshCw',
    badge: 'Universal Engine',
    tags: ['Converter', 'MP3', 'WAV', 'MP4', 'PNG', 'Audio', 'Video'],
    popular: true,
    outputType: 'interactive',
    inputs: [
      { id: 'sourceType', label: 'Input Source Format', type: 'select', defaultValue: 'WAV', options: [
        { label: 'WAV Audio (Lossless Uncompressed)', value: 'WAV' },
        { label: 'MP3 Audio (MPEG Layer 3)', value: 'MP3' },
        { label: 'MP4 Video (H.264)', value: 'MP4' },
        { label: 'MOV Video (Apple QuickTime)', value: 'MOV' },
        { label: 'PNG Image (Lossless)', value: 'PNG' },
        { label: 'JPG Image (Standard)', value: 'JPG' },
        { label: 'WEBP Image (Modern Web)', value: 'WEBP' }
      ]},
      { id: 'targetType', label: 'Target Output Format', type: 'select', defaultValue: 'MP3', options: [
        { label: 'MP3 (320kbps High-Quality Audio)', value: 'MP3' },
        { label: 'WAV (24-bit 48kHz Studio Audio)', value: 'WAV' },
        { label: 'MP4 (Web Optimized Video)', value: 'MP4' },
        { label: 'WEBP (High Efficiency Web Image)', value: 'WEBP' },
        { label: 'JPG (Universal Photo Format)', value: 'JPG' },
        { label: 'PNG (Transparent Compatible)', value: 'PNG' }
      ]},
      { id: 'audioBitrate', label: 'Audio Bitrate (if applicable)', type: 'select', defaultValue: '320k', options: [
        { label: '320 kbps (Maximum MP3 Quality)', value: '320k' },
        { label: '256 kbps (Standard High Quality)', value: '256k' },
        { label: '192 kbps (Balanced)', value: '192k' },
        { label: '128 kbps (Lightweight)', value: '128k' }
      ]}
    ]
  },

  // ==========================================
  // SEO, ANALYTICS & WEB UTILITIES SUITE (8 tools)
  // ==========================================
  {
    id: 'ai-rank-tracker',
    name: 'AI Rank Tracker',
    slug: 'ai-rank-tracker',
    category: 'SEO & Analytics',
    description: 'Track keyword rankings across Google, Spotify Search, and YouTube with competitor visibility scoring and SERP movement analysis.',
    shortDescription: 'Track Google, Spotify & YouTube keyword rankings.',
    icon: 'TrendingUp',
    tags: ['SEO', 'Rankings', 'Keywords', 'SERP', 'Tracking'],
    outputType: 'analysis',
    inputs: [
      { id: 'keyword', label: 'Target Keyword / Artist Name', type: 'text', placeholder: 'e.g., electronic music label London, AI Suite', required: true },
      { id: 'domain', label: 'Your Website or Spotify URL', type: 'text', placeholder: 'e.g., https://sanelabel.com', required: true }
    ]
  },
  {
    id: 'ai-search-engine',
    name: 'AI Search Engine',
    slug: 'ai-search-engine',
    category: 'SEO & Analytics',
    description: 'AI-powered studio search engine that synthesizes answers, citations, and relevant links across music industry data and web knowledge.',
    shortDescription: 'AI-synthesized studio research & citations.',
    icon: 'Search',
    badge: 'Gemini AI',
    tags: ['Search', 'AI Search', 'Knowledge', 'Research'],
    popular: true,
    outputType: 'markdown',
    inputs: [
      { id: 'query', label: 'Search Query or Industry Question', type: 'textarea', placeholder: 'e.g., What are the best distributor sync licensing terms in 2026? How do algorithmic Spotify radio tiers work?', required: true }
    ]
  },
  {
    id: 'ai-link-shortener',
    name: 'AI Link Shortener & Smart Link',
    slug: 'ai-link-shortener',
    category: 'SEO & Analytics',
    description: 'Generate branded smart music release landing links with QR code generator, dynamic multi-store routing (Spotify, Apple, YouTube), and live analytics dashboard.',
    shortDescription: 'Smart release links, QR codes & click analytics.',
    icon: 'Link2',
    badge: 'Dynamic Analytics',
    tags: ['Smart Link', 'Shortener', 'QR Code', 'Analytics', 'Music Release'],
    popular: true,
    outputType: 'interactive',
    inputs: [
      { id: 'originalUrl', label: 'Destination Landing URL', type: 'text', placeholder: 'https://open.spotify.com/album/...', required: true },
      { id: 'title', label: 'Release / Smart Link Title', type: 'text', placeholder: 'e.g., AI Horizon - Midnight EP (Out Now)', required: true },
      { id: 'customAlias', label: 'Custom Slug Alias (Optional)', type: 'text', placeholder: 'e.g., midnight-ep' }
    ]
  },
  {
    id: 'competitor-intelligence',
    name: 'Competitor Intelligence Tool',
    slug: 'competitor-intelligence',
    category: 'SEO & Analytics',
    description: 'Benchmark competing record labels and artists: analyze release frequency, playlist placements, engagement rates, and growth strategies.',
    shortDescription: 'Benchmark competitor labels, playlist reaches & strategy.',
    icon: 'Target',
    tags: ['Competitors', 'Intelligence', 'Benchmark', 'Strategy'],
    outputType: 'analysis',
    inputs: [
      { id: 'competitorName', label: 'Competitor Artist or Label Name', type: 'text', placeholder: 'e.g., Anjunadeep, Afterlife, Defected Records', required: true },
      { id: 'yourNiche', label: 'Your Genre / Product Market', type: 'text', placeholder: 'e.g., Melodic Deep House, Independent Cyber-Label', required: true }
    ]
  },
  {
    id: 'internet-speed-test',
    name: 'Internet Speed Test Tool',
    slug: 'internet-speed-test',
    category: 'SEO & Analytics',
    description: 'Interactive bandwidth speed test measuring download speed, upload speed, latency (ping), and jitter for high-throughput studio streaming.',
    shortDescription: 'Real-time studio download, upload & ping speed test.',
    icon: 'Zap',
    badge: 'Live Gauge',
    tags: ['Speed Test', 'Bandwidth', 'Ping', 'Download', 'Upload'],
    popular: true,
    outputType: 'interactive',
    inputs: []
  },
  {
    id: 'seo-analysis',
    name: 'SEO Analysis Tool',
    slug: 'seo-analysis',
    category: 'SEO & Analytics',
    description: 'Comprehensive website audit: tests Core Web Vitals, header hierarchy, alt tags, schema markup, mobile responsiveness, and SEO score.',
    shortDescription: 'Full on-page SEO audit & Core Web Vitals score.',
    icon: 'BarChart2',
    tags: ['SEO', 'Audit', 'Core Web Vitals', 'Performance'],
    outputType: 'analysis',
    inputs: [
      { id: 'url', label: 'Website URL to Audit', type: 'text', placeholder: 'https://example.com', required: true }
    ]
  },
  {
    id: 'website-speed-test',
    name: 'Website Speed Test Tool',
    slug: 'website-speed-test',
    category: 'SEO & Analytics',
    description: 'Analyze page load speed, TTFB (Time to First Byte), asset payload weight, and server response times.',
    shortDescription: 'Analyze TTFB, asset payloads & page load speeds.',
    icon: 'Clock',
    tags: ['Speed', 'Performance', 'TTFB', 'Load Time'],
    outputType: 'analysis',
    inputs: [
      { id: 'siteUrl', label: 'Target Website URL', type: 'text', placeholder: 'https://example.com', required: true }
    ]
  },
  {
    id: 'whats-my-ip',
    name: 'What’s My IP Tool',
    slug: 'whats-my-ip',
    category: 'SEO & Analytics',
    description: 'Discover your public IPv4/IPv6 address, ISP hostname, geographic location, ASN network, and browser headers.',
    shortDescription: 'Detect public IP, geolocation, ISP & network ASN.',
    icon: 'Compass',
    tags: ['IP', 'Network', 'ISP', 'Location', 'Security'],
    outputType: 'interactive',
    inputs: []
  },

  // ==========================================
  // VIDEO AI SUITE (3 tools)
  // ==========================================
  {
    id: 'ai-video-enhancer',
    name: 'AI Video Enhancer',
    slug: 'ai-video-enhancer',
    category: 'Video AI',
    description: 'Upscale music videos and live sets to 4K 60FPS with AI frame interpolation, noise reduction, and cinematic color stabilization.',
    shortDescription: 'Upscale music videos to 4K 60FPS with color grading.',
    icon: 'Film',
    badge: '4K Studio',
    tags: ['Video', 'Upscale', '4K', '60FPS', 'Music Video'],
    popular: true,
    outputType: 'interactive',
    inputs: [
      { id: 'resolution', label: 'Target Video Resolution', type: 'select', defaultValue: '4k', options: [
        { label: '4K Ultra HD (3840 x 2160)', value: '4k' },
        { label: '1080p Full HD (1920 x 1080)', value: '1080p' }
      ]},
      { id: 'framerate', label: 'Frame Interpolation', type: 'select', defaultValue: '60fps', options: [
        { label: '60 FPS (Ultra Smooth Motion)', value: '60fps' },
        { label: '24 FPS (Cinematic Film Cadence)', value: '24fps' }
      ]},
      { id: 'colorGrade', label: 'Cinematic Color Grading Preset', type: 'select', defaultValue: 'cyber_neon', options: [
        { label: 'Cyber Neon Red & High Contrast', value: 'cyber_neon' },
        { label: 'Warm 35mm Vintage Film Stock', value: 'vintage_film' },
        { label: 'Cold Moody Nordic Bleach Bypass', value: 'nordic' }
      ]}
    ]
  },
  {
    id: 'ai-video-object-remover',
    name: 'AI Video Object Remover',
    slug: 'ai-video-object-remover',
    category: 'Video AI',
    description: 'Erase unwanted background objects, watermarks, microphones, wires, and photobombers from music video footage with temporal inpainting.',
    shortDescription: 'Remove watermarks, wires & objects from video.',
    icon: 'Trash2',
    tags: ['Inpainting', 'Video Edit', 'Object Removal', 'Clean'],
    outputType: 'interactive',
    inputs: [
      { id: 'targetObject', label: 'Object / Element to Erase', type: 'text', placeholder: 'e.g., microphone stand in center frame, watermark in bottom right corner', required: true }
    ]
  },
  {
    id: 'ai-youtube-downloader',
    name: 'AI YouTube Downloader',
    slug: 'ai-youtube-downloader',
    category: 'Video AI',
    description: 'Extract audio stems, MP3 320kbps audio, and high-resolution video streams from YouTube links for DJ sampling and remix reference.',
    shortDescription: 'Extract 320kbps MP3 audio & video stems from YouTube.',
    icon: 'Download',
    badge: 'Audio / Video',
    tags: ['YouTube', 'Download', 'MP3', 'Audio Extract', 'Sampler'],
    popular: true,
    outputType: 'interactive',
    inputs: [
      { id: 'videoUrl', label: 'YouTube Video Link', type: 'text', placeholder: 'https://www.youtube.com/watch?v=...', required: true },
      { id: 'format', label: 'Extraction Format', type: 'select', defaultValue: 'mp3', options: [
        { label: 'Audio MP3 (320 kbps High Quality Master)', value: 'mp3' },
        { label: 'Audio WAV (Lossless Format for Sampling)', value: 'wav' },
        { label: 'Video MP4 1080p (Full HD)', value: 'mp4' }
      ]}
    ]
  }
];

// Helper functions for lookup & SEO
export function getToolInfoBySlug(slug: string): ToolDefinition | undefined {
  return TOOLS.find((t) => t.slug === slug || t.id === slug);
}

export function getToolsByCategory(category: string): ToolDefinition[] {
  if (category === 'All') return TOOLS;
  return TOOLS.filter((t) => t.category === category);
}

export function generateToolMetadata(slug: string): SeoMetadata {
  const tool = getToolInfoBySlug(slug);
  if (!tool) {
    return {
      title: 'AI Suite | 54 AI Tools Platform',
      description: 'Production-grade multi-tool AI suite for audio, marketing, visual, documents, and web utilities.',
      openGraph: {
        title: 'AI Suite',
        description: 'Production-grade multi-tool AI suite',
        type: 'website',
      },
      alternates: {
        canonical: 'https://aisuite.studio/tools',
      },
    };
  }

  return {
    title: `${tool.name} | Free Online AI Tool - AI Suite`,
    description: `Use ${tool.name} online for free. ${tool.description} 20 free uses per week or $10/mo for unlimited access.`,
    openGraph: {
      title: `${tool.name} - AI Suite`,
      description: tool.description,
      type: 'website',
    },
    alternates: {
      canonical: `https://aisuite.studio/tools/${tool.slug}`,
    },
  };
}

export function generateJsonLdSchema(tool: ToolDefinition) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': tool.name,
    'description': tool.description,
    'applicationCategory': tool.category,
    'operatingSystem': 'Any (Web Browser)',
    'offers': {
      '@type': 'Offer',
      'price': '0.00',
      'priceCurrency': 'USD',
      'description': '20 free tool executions per week. Unlimited Pro access for $10/month.'
    },
    'author': {
      '@type': 'Organization',
      'name': 'AI Suite',
      'url': 'https://aisuite.studio'
    }
  };
}

export const TOOLS_REGISTRY = TOOLS;

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return TOOLS.find(t => t.slug === slug || t.id === slug);
}

export function getRelatedTools(category: string, currentSlug: string, limit: number = 3): ToolDefinition[] {
  return TOOLS
    .filter(t => t.category === category && t.slug !== currentSlug)
    .slice(0, limit);
}

export function generateToolJsonLd(tool: ToolDefinition) {
  return generateJsonLdSchema(tool);
}
