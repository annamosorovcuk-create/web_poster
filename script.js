document.addEventListener('DOMContentLoaded', function() {


/*СЛАЙД 1 */
    
    const correctSequence = [
        { id: 'element-1', name: 'звук', order: 1 },
        { id: 'element-2', name: 'нота', order: 2 },
        { id: 'element-3', name: 'аккорд', order: 3 },
        { id: 'element-4', name: 'мелодия', order: 4 },
        { id: 'element-5', name: 'композиция', order: 5 },
        { id: 'element-6', name: 'песня', order: 6 },
        { id: 'element-7', name: 'альбом', order: 7 },
        { id: 'element-8', name: 'сетлист', order: 8 },
        { id: 'element-9', name: 'выступление', order: 9 }
    ];
    
//Состояние игры 
    let placedWords = [];
    let currentDraggedElement = null;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let elementStartLeft = 0;
    let elementStartTop = 0;
    
// элементы 
    const container = document.getElementById('draggableWordsContainer');
    const dropZone = document.getElementById('dropZone');
    const finalWord = document.getElementById('finalWord');
    
// есть ли элементы для слайда 1 
    if (container && dropZone && finalWord) {
        
//перетаскиваемые слова 
        function createDraggableWords() {
            correctSequence.forEach((word) => {
                const wordElement = document.createElement('img');
                
                wordElement.src = `assets/${word.id}.png`;
                wordElement.alt = word.name;
                wordElement.className = 'draggable-word';
                wordElement.id = word.id;
                wordElement.setAttribute('data-order', word.order);
                wordElement.setAttribute('data-name', word.name);
                
                makeDraggable(wordElement);
                container.appendChild(wordElement);
            });
        }
        
// сделать элемент перетаскиваемым 
        function makeDraggable(element) {
            element.addEventListener('pointerdown', onPointerDown);
            element.addEventListener('dragstart', (e) => e.preventDefault());
        }
        
// Обработчик начала перетаскивания
        function onPointerDown(e) {
            e.preventDefault();
            const element = e.currentTarget;
            
            if (element.style.opacity === '0.3' || element.classList.contains('placed')) {
                return;
            }
            
            currentDraggedElement = element;
            isDragging = true;
            
            dragStartX = e.clientX;
            dragStartY = e.clientY;
            
            const computedStyle = window.getComputedStyle(element);
            elementStartLeft = parseFloat(computedStyle.left);
            elementStartTop = parseFloat(computedStyle.top);
            
            element.classList.add('dragging');
            element.style.transform = 'rotate(0deg)';
            element.style.zIndex = '100';
            
            dropZone.classList.add('active');
            
            window.addEventListener('pointermove', onPointerMove);
            window.addEventListener('pointerup', onPointerUp);
        }
        
// Обработчик перемещения 
        function onPointerMove(e) {
            if (!isDragging || !currentDraggedElement) return;
            
            e.preventDefault();
            
            const deltaX = e.clientX - dragStartX;
            const deltaY = e.clientY - dragStartY;
            
            let newLeft = elementStartLeft + deltaX;
            let newTop = elementStartTop + deltaY;
            
            newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - currentDraggedElement.offsetWidth));
            newTop = Math.max(0, Math.min(newTop, window.innerHeight - currentDraggedElement.offsetHeight));
            
            currentDraggedElement.style.left = `${newLeft}px`;
            currentDraggedElement.style.top = `${newTop}px`;
        }
        
 // Обработчик окончания перетаскивания 
        function onPointerUp(e) {
            if (!isDragging || !currentDraggedElement) {
                cleanup();
                return;
            }
            
            const dropZoneRect = dropZone.getBoundingClientRect();
            const elementRect = currentDraggedElement.getBoundingClientRect();
            
            const isInDropZone = elementRect.right > dropZoneRect.left &&
                                elementRect.left < dropZoneRect.right &&
                                elementRect.bottom > dropZoneRect.top &&
                                elementRect.top < dropZoneRect.bottom;
            
            if (isInDropZone) {
                const currentOrder = parseInt(currentDraggedElement.getAttribute('data-order'));
                const nextExpectedOrder = placedWords.length + 1;
                
                if (currentOrder === nextExpectedOrder) {
                    placeWordCorrectly(currentDraggedElement);
                } else {
                    resetWordPosition(currentDraggedElement);
                }
            } else {
                resetWordPosition(currentDraggedElement);
            }
            
            cleanup();
        }
        
// Функция для правильного размещения слова 
        function placeWordCorrectly(element) {
            placedWords.push({ element: element });
            
            element.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            element.style.opacity = '0';
            element.style.transform = 'scale(0.8)';
            element.classList.add('placed');
            element.style.pointerEvents = 'none';
            
            setTimeout(() => {
                element.style.display = 'none';
            }, 300);
            
            if (placedWords.length === correctSequence.length) {
                showFinalWord();
            }
        }
        
// Функция для возврата слова на исходную позицию 
        function resetWordPosition(element) {
            element.style.left = '';
            element.style.top = '';
            element.style.transform = '';
            element.style.transition = 'left 0.3s ease, top 0.3s ease, transform 0.3s ease';
            
            setTimeout(() => {
                element.style.transition = '';
            }, 300);
        }
        
//  Очистка после перетаскивания 
        function cleanup() {
            if (currentDraggedElement) {
                currentDraggedElement.classList.remove('dragging');
                currentDraggedElement.style.zIndex = '';
            }
            
            isDragging = false;
            currentDraggedElement = null;
            dropZone.classList.remove('active');
            
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
        }
        
    // Показать финальное слово 
    function showFinalWord() {
    
    finalWord.style.display = 'block';
    
    
    // Находит изображение и добавляет обработчик
    const concertImage = finalWord.querySelector('.concert-image');
    if (concertImage) {
        concertImage.style.cursor = 'pointer';
        
        // Убирает старые обработчики
        const newImage = concertImage.cloneNode(true);
        concertImage.parentNode.replaceChild(newImage, concertImage);
        
        // Добавляет обработчик
        newImage.onclick = function(e) {
            e.stopPropagation();
            finalWord.style.display = 'none';
            finalWord.style.animation = '';
            };
        }
    }
        
        // Запуск 
        createDraggableWords();
    }


/*СЛАЙД 2*/


(function() {
// есть ли элементы для слайда 2 на странице
    const notesContainer = document.getElementById('notesContainer');
    const dropZone1 = document.getElementById('dropZone1');
    const dropZone2 = document.getElementById('dropZone2');
    const dropZone3 = document.getElementById('dropZone3');
    const dropZone4 = document.getElementById('dropZone4');
    const finalGameImage = document.getElementById('finalGameImage');
    
    // Если элементов нет, выходит 
    if (!notesContainer || !dropZone1 || !dropZone2 || !dropZone3 || !dropZone4) {
        return;
    }
    
    const noteTypes = {
        'without-tail': { name: 'без хвостика', zone: 1 },
        'with-tail': { name: 'с хвостиком', zone: 2 },
        '2-tails': { name: 'с 2 хвостиками', zone: 3 },
        'double-note': { name: 'двойная нота', zone: 4 }
    };
    
    // Создает массив всех нот
    const allNotes = [
        // Без хвостика 
        { id: 'without-tail-1', type: 'without-tail' },
        { id: 'without-tail-2', type: 'without-tail' },
        { id: 'without-tail-3', type: 'without-tail' },
        // С хвостиком 
        { id: 'with-tail-1', type: 'with-tail' },
        { id: 'with-tail-2', type: 'with-tail' },
        { id: 'with-tail-3', type: 'with-tail' },
        // С 2 хвостиками 
        { id: 'two_tails-1', type: '2-tails' },
        { id: 'two_tails-2', type: '2-tails' },
        { id: 'two_tails-3', type: '2-tails' },
        // Двойные ноты 
        { id: 'double_note-1', type: 'double-note' },
        { id: 'double_note-2', type: 'double-note' },
        { id: 'double_note-3', type: 'double-note' }
    ];
    
    // Состояние игры 
    let placedNotes = [];
    let currentDraggedNote = null;
    let isDraggingNote = false;  
    
    const dropZones = {
        1: dropZone1,
        2: dropZone2,
        3: dropZone3,
        4: dropZone4
    };
    
    // перетаскиваемые ноты ---
    function createDraggableNotes() {
        allNotes.forEach((note) => {
            const noteElement = document.createElement('img');
            
            noteElement.src = `assets/${note.id}.png`;
            noteElement.alt = noteTypes[note.type].name;
            noteElement.className = 'draggable-note';
            noteElement.id = note.id;
            noteElement.setAttribute('data-type', note.type);
            noteElement.setAttribute('data-zone', noteTypes[note.type].zone);
            
            makeDraggable(noteElement);
            notesContainer.appendChild(noteElement);
        });
    }
    
    //сделать элемент перетаскиваемым 
    function makeDraggable(element) {
        element.addEventListener('pointerdown', onPointerDown);
        element.addEventListener('dragstart', (e) => e.preventDefault());
    }
    
    // Обработчик начала перетаскивания
    function onPointerDown(e) {
        e.preventDefault();
        const element = e.currentTarget;
        
        if (element.style.opacity === '0.3' || element.classList.contains('placed')) {
            return;
        }
        
        currentDraggedNote = element;
        isDraggingNote = true;
        
        // где именно нажали на элемент
        const rect = element.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;
        
        element.dragOffsetX = offsetX;
        element.dragOffsetY = offsetY;
        
        element.classList.add('dragging');
        element.style.transform = 'rotate(0deg)';
        element.style.zIndex = '100';
        
        // Подсвечивает все зоны сброса
        Object.values(dropZones).forEach(zone => {
            if (zone) zone.classList.add('active');
        });
        
        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
    }
    
    // Обработчик перемещения 
    function onPointerMove(e) {
        if (!isDraggingNote || !currentDraggedNote) return;
        
        e.preventDefault();
        
        let newLeft = e.clientX - currentDraggedNote.dragOffsetX;
        let newTop = e.clientY - currentDraggedNote.dragOffsetY;
        
        newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - currentDraggedNote.offsetWidth));
        newTop = Math.max(0, Math.min(newTop, window.innerHeight - currentDraggedNote.offsetHeight));
        
        currentDraggedNote.style.left = `${newLeft}px`;
        currentDraggedNote.style.top = `${newTop}px`;
    }
    
    //  Обработчик окончания перетаскивания
    function onPointerUp(e) {
        if (!isDraggingNote || !currentDraggedNote) {
            cleanup();
            return;
        }
        
        const correctZone = parseInt(currentDraggedNote.getAttribute('data-zone'));
        let placedInCorrectZone = false;
        
        // Проверка каждой зоны
        for (let zoneNum = 1; zoneNum <= 4; zoneNum++) {
            const zone = dropZones[zoneNum];
            if (!zone) continue;
            
            const zoneRect = zone.getBoundingClientRect();
            const noteRect = currentDraggedNote.getBoundingClientRect();
            
            const isInZone = noteRect.right > zoneRect.left &&
                            noteRect.left < zoneRect.right &&
                            noteRect.bottom > zoneRect.top &&
                            noteRect.top < zoneRect.bottom;
            
            if (isInZone) {
                if (zoneNum === correctZone) {
                    placedInCorrectZone = true;
                    placeNoteCorrectly(currentDraggedNote);
                } else {
                    resetNotePosition(currentDraggedNote);
                }
                break;
            }
        }
        
        if (!placedInCorrectZone) {
            resetNotePosition(currentDraggedNote);
        }
        
        cleanup();
    }
    
    // Функция для правильного размещения ноты
    function placeNoteCorrectly(note) {
        placedNotes.push({ note: note });
        
        note.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        note.style.opacity = '0';
        note.style.transform = 'scale(0.8)';
        note.classList.add('placed');
        note.style.pointerEvents = 'none';
        
        setTimeout(() => {
            note.style.display = 'none';
        }, 300);
        
        // все ли ноты размещены 
        if (placedNotes.length === allNotes.length) {
            showFinalImage();
        }
    }
    
    // Функция для возврата ноты на исходную позицию 
    function resetNotePosition(note) {
       
        note.style.left = '';
        note.style.top = '';
        note.style.transform = '';
        note.style.transition = 'left 0.3s ease, top 0.3s ease, transform 0.3s ease';
        
        setTimeout(() => {
            note.style.transition = '';
        }, 300);
    }
    
    // финальное изображение
    function showFinalImage() {
        if (!finalGameImage) return;
        
        finalGameImage.style.display = 'block';
        finalGameImage.style.animation = 'fadeInScale 0.5s ease-out forwards';
        
        const finalImg = finalGameImage.querySelector('.final-game-img');
        if (finalImg) {
            finalImg.style.cursor = 'pointer';
            
            const newImage = finalImg.cloneNode(true);
            finalImg.parentNode.replaceChild(newImage, finalImg);
            
            newImage.onclick = function(e) {
                e.stopPropagation();
                finalGameImage.style.display = 'none';
                finalGameImage.style.animation = '';
            };
        }
    }
    
    //Очистка
    function cleanup() {
        if (currentDraggedNote) {
            currentDraggedNote.classList.remove('dragging');
            currentDraggedNote.style.zIndex = '';
            delete currentDraggedNote.dragOffsetX;
            delete currentDraggedNote.dragOffsetY;
        }
        
        isDraggingNote = false;
        currentDraggedNote = null;
        
        // Убирает подсветку со всех зон
        Object.values(dropZones).forEach(zone => {
            if (zone) zone.classList.remove('active');
        });
        
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
    }
    
    //  Запуск для слайда 2
    createDraggableNotes();
})();

    
/*СЛАЙД 3 */
    const pose1 = document.getElementById('pose-1');
    const pose2 = document.getElementById('pose-2');
    const pose3 = document.getElementById('pose-3');
    const pose4 = document.getElementById('pose-4');
    
    const btnA = document.getElementById('btn-a');
    const btnW = document.getElementById('btn-w');
    const btnD = document.getElementById('btn-d');
    const btnS = document.getElementById('btn-s');
    
    const allPoses = [pose1, pose2, pose3, pose4];
    
    function hideAllPoses() {
        allPoses.forEach(pose => {
            if (pose) pose.classList.remove('active');
        });
    }
    
    function showPose(poseElement) {
        if (!poseElement) return;
        hideAllPoses();
        poseElement.classList.add('active');
    }
    
    if (btnA) btnA.addEventListener('click', () => showPose(pose1));
    if (btnW) btnW.addEventListener('click', () => showPose(pose2));
    if (btnD) btnD.addEventListener('click', () => showPose(pose3));
    if (btnS) btnS.addEventListener('click', () => showPose(pose4));
    
    // Управление с клавиатуры
    document.addEventListener('keydown', function(event) {
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') return;
        
        const key = event.key.toLowerCase();
        switch(key) {
            case 'a': event.preventDefault(); showPose(pose1); break;
            case 'w': event.preventDefault(); showPose(pose2); break;
            case 'd': event.preventDefault(); showPose(pose3); break;
            case 's': event.preventDefault(); showPose(pose4); break;
        }
    });
    
    /*СЛАЙД 4 */

    const dragImage = document.getElementById('dragTriggerImage');
    const ballContainer = document.getElementById('ballContainer');
    const playlistWrapper = document.querySelector('.playlist-wrapper');
    const playheadBall = document.getElementById('playheadBall');
    const playlistImage = document.querySelector('.playlist');
    

    const audioElements = [
        document.getElementById('audio1'),
        document.getElementById('audio2'),
        document.getElementById('audio3')
    ];
    
    const ballImages = [
        'assets/ball_1.png',
        'assets/ball_2.png',
        'assets/ball_3.png'
    ];
    
    let currentAudio = null;
    let animationFrameId = null;
    let isPlaying = false;
    let startPosition = 0;  // Начальная позиция бегунка 
    let endPosition = 0; // Конечная позиция бегунка 
    
    function updateTrackBoundaries() {
        if (!playlistWrapper || !playlistImage || !playheadBall) return;
        
        const wrapperRect = playlistWrapper.getBoundingClientRect();
        const imageRect = playlistImage.getBoundingClientRect();
        const ballWidth = playheadBall.offsetWidth;
        
        // Начало отступ слева 
        startPosition = 45; // Пикселей от левого края 
        
        // Конец 
        const rightOffset = 45; 
        endPosition = wrapperRect.width - ballWidth - rightOffset;
        
        // позиции не отрицательные
        startPosition = Math.max(0, startPosition);
        endPosition = Math.max(startPosition + 10, endPosition);
        
        // начальная позиция бегунка (если музыка не играет)
        if (!isPlaying) {
            playheadBall.style.left = `${startPosition}px`;
        }
    }
    
    // Остановить музыку и сбросить бегунок 
    function stopMusicAndReset() {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
            currentAudio = null;
        }
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        isPlaying = false;
        
        // бегунок на начальную позицию
        if (playheadBall) {
            playheadBall.style.left = `${startPosition}px`;
        }
    }
    
    //  анимация бегунка на 5 секунд 
    function startPlayheadAnimation(duration = 5000) {
        
        updateTrackBoundaries();
        
        const distance = endPosition - startPosition;
        const startTime = performance.now();
        
        function updatePlayhead(currentTime) {
            const elapsed = currentTime - startTime;
            let progress = Math.min(elapsed / duration, 1);
            
            // новая позиция
            let newLeft = startPosition + (progress * distance);
            playheadBall.style.left = `${newLeft}px`;
            
            if (progress < 1) {
                // Продолжение анимации
                animationFrameId = requestAnimationFrame(updatePlayhead);
            } else {
                // Анимация завершена
                animationFrameId = null;
            }
        }
        
        // Запуск анимации
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        animationFrameId = requestAnimationFrame(updatePlayhead);
    }
    
    // Воспроизвести звук для выбранного шарика
    function playSoundForBall(ballIndex) {
        if (isPlaying) {
            // Если уже играет, останавливает предыдущий
            stopMusicAndReset();
        }
        
        // аудио по индексу
        const audioToPlay = audioElements[ballIndex];
        if (!audioToPlay) {
            console.error('Аудио не найдено для индекса', ballIndex);
            return;
        }
        
        currentAudio = audioToPlay;
        isPlaying = true;
        
        // Запуск анимации бегунка 
        startPlayheadAnimation(5000);
        
        // Воспроизводит звук
        audioToPlay.play().catch(e => console.log('Ошибка воспроизведения:', e));
        
        // Останавливает музыку через 5 секунд
        const stopTimeout = setTimeout(() => {
            if (isPlaying && currentAudio === audioToPlay) {
                stopMusicAndReset();
            }
        }, 5000);
        
        // Обработчик окончания аудио
        audioToPlay.onended = () => {
            clearTimeout(stopTimeout);
            if (isPlaying && currentAudio === audioToPlay) {
                stopMusicAndReset();
            }
        };
    }
    
    //  Создать и показать случайный шарик в центре 
    function showRandomBall() {
        // Очищает контейнер
        ballContainer.innerHTML = '';
        
        // Выбирает случайный индекс 
        const randomIndex = Math.floor(Math.random() * 3);
        const imagePath = ballImages[randomIndex];
        
        // элемент изображения
        const ballImg = document.createElement('img');
        ballImg.src = imagePath;
        ballImg.className = 'random-ball';
        ballImg.alt = 'Magic Ball';
        
        // Сохраняет индекс выбранного шарика
        ballImg.dataset.ballIndex = randomIndex;
        
        // Добавляет в контейнер
        ballContainer.appendChild(ballImg);
        
        // Обработчик клика по шарику
        ballImg.addEventListener('click', function onClickBall(e) {
            e.stopPropagation();
            
            const index = parseInt(this.dataset.ballIndex);
            
            // Удаляет шарик
            ballContainer.innerHTML = '';
            
            // Запускает музыку, связанную с этим шариком
            playSoundForBall(index);
        });
    }
    
    // нажатие на фото Drag 
    if (dragImage) {
        dragImage.addEventListener('click', () => {
            // Если играет музыка, останавливает
            if (isPlaying) {
                stopMusicAndReset();
            }
            
            // Убирает старый шарик, если он есть
            ballContainer.innerHTML = '';
            
            // Показывает новый случайный шарик
            showRandomBall();
        });
    }
   
    // Ждет загрузки изображения плейлиста, чтобы получить корректные размеры
    if (playlistImage) {
        if (playlistImage.complete) {
            updateTrackBoundaries();
        } else {
            playlistImage.addEventListener('load', updateTrackBoundaries);
        }
    }
    
    // Обновляет границы при изменении размера окна
    window.addEventListener('resize', () => {
        updateTrackBoundaries();
        if (isPlaying) {
            // Если музыка играет, пересчитывает позицию бегунка
            if (currentAudio && currentAudio.currentTime) {
                const progress = currentAudio.currentTime / 5;
                const distance = endPosition - startPosition;
                let newLeft = startPosition + (progress * distance);
                playheadBall.style.left = `${newLeft}px`;
            }
        } else {
            // Если музыка не играет, возвращает в начало
            playheadBall.style.left = `${startPosition}px`;
        }
    });
    
    // Первоначальное обновление позиций
    setTimeout(updateTrackBoundaries, 100);

});