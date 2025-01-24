class Calendar{

    constructor( containerID, today = null, arrEvents = [], days = []){
        this.containerID = containerID;
        this.today = (today == null ? new Date() : today);
        this.events = arrEvents; 
        this.days = (days.length == 0 ? ['Po','Út','St','Čt','Pá','So','Ne']: days);       
        for (let i = 0; i < this.events.length; i++) {
            this.events[i].date = this.normalizeDate(this.events[i].date);
        }
    }

    normalizeDate(date) {
        return date.toISOString().slice(0, 10); // "YYYY-MM-DD"
    }

    /* TODO
    addEvent(name, date, redraw = false){
        date = this.normalizeDate(date)
        this.events.push({name:name, date: date});
        if(redraw){
            this.redrawCalendar();
        }
    }
    */

    createNavigationBar() {
        const navigationBar = document.createElement('div');
        navigationBar.classList.add('navigation-bar');
    
        const prevButton = document.createElement('button');
        prevButton.id = 'btn-prev';
        prevButton.innerHTML = '&larr;';
    
        const datePicker = document.createElement('input');
        datePicker.id = 'date-picker';
        datePicker.type = 'date';
    
        const nextButton = document.createElement('button');
        nextButton.id = 'btn-next';
        nextButton.innerHTML = '&rarr;';
    
        navigationBar.appendChild(prevButton);
        navigationBar.appendChild(datePicker);
        navigationBar.appendChild(nextButton);
    
        return navigationBar;
    }

    render(){
        this.redrawCalendar();
        document.getElementById('date-picker').value = this.today.toISOString().split('T')[0];
    }

    redrawCalendar(){
        const container = document.getElementById(this.containerID);
        if( !container){
            throw ReferenceError(`Element with ID: ${this.containerID} not found`);
        }
        container.innerHTML = '';
        container.appendChild( this.createNavigationBar());

        const daysInActualMonth = this.getDaysInMonth(this.today.getFullYear(), this.today.getMonth());
        const firstDayInActualMonth = new Date(daysInActualMonth[0]);
        
        let htmlMainDivCalendar = document.createElement('div');
        htmlMainDivCalendar.classList.add('calendar-container');

        let htmlDay = null;

        for(let i = 0; i < this.days.length; i++) {
            htmlDay = document.createElement('div');
            htmlDay.classList.add('calendar-cell');
            htmlDay.classList.add('header');
            htmlDay.innerText = this.days[i];
            htmlMainDivCalendar.appendChild(htmlDay);
        }

        let daysInPrevMonth = this.getDaysInPrevMonth(this.today);
        for(    let i = daysInPrevMonth.length - (firstDayInActualMonth.getDay() == 0 ? 7-1 : firstDayInActualMonth.getDay()-1); 
                i < daysInPrevMonth.length; 
                i++ ) {
            htmlDay = document.createElement('div');
            htmlDay.classList.add('calendar-cell-other-month');
            htmlDay.innerText = new Date(daysInPrevMonth[i]).getDate();
            htmlMainDivCalendar.appendChild(htmlDay);
        }

        for( let i = 0; i < daysInActualMonth.length; i++) {
            htmlDay = document.createElement('div');
            htmlDay.classList.add('calendar-cell');
            if( this.today.getDate()-1 == i){
                htmlDay.classList.add('cell-today');
            }
            const foundEvents = this.events.filter(row => this.normalizeDate(new Date(daysInActualMonth[i])) == row.date);
            if( foundEvents.length>0){
                const calendarEvent = document.createElement('div');
                calendarEvent.classList.add('event');
                calendarEvent.innerText = i+1;
                calendarEvent.title = this.getTitle(foundEvents);
                htmlDay.appendChild(calendarEvent);
            }else{
                htmlDay.innerText = i+1;
            }
            htmlMainDivCalendar.appendChild(htmlDay);
        }

        const nextMonthLength = 49 - htmlMainDivCalendar.childElementCount;
        for( let i = 0; i < nextMonthLength; i++ ) {
            htmlDay = document.createElement('div');
            htmlDay.classList.add('calendar-cell-other-month');
            htmlDay.innerText = i+1;
            htmlMainDivCalendar.appendChild(htmlDay);
        }

        container.appendChild(htmlMainDivCalendar);
        this.appendCalendarEvents();
    }

    getTitle(foundEvents){
        return foundEvents.map(event => event.name).join(',');
    }

    appendCalendarEvents(){
        const nextButton = document.getElementById('btn-next');
        nextButton.addEventListener('click', ()=>{
            const actualMonth = this.today.getMonth();
            const actualYear = this.today.getFullYear();
            if( actualMonth == 11){
                this.today.setMonth(0);
                this.today.setFullYear(actualYear+1);
            }else{
                this.today.setMonth(actualMonth+1);
            }
            this.redrawCalendar();
            document.getElementById('date-picker').value = this.today.toISOString().split('T')[0];
        });

        const prevButton = document.getElementById('btn-prev');
        prevButton.addEventListener('click', ()=>{
            const actualMonth = this.today.getMonth();
            const actualYear = this.today.getFullYear();
            if( actualMonth == 0){
                this.today.setMonth(11);
                this.today.setFullYear(actualYear-1);
            }else{
                this.today.setMonth(actualMonth-1);
            }
            this.redrawCalendar();
            document.getElementById('date-picker').value = this.today.toISOString().split('T')[0];
        });

        const datePicker = document.getElementById('date-picker');
        datePicker.addEventListener('blur', (e)=>{
            this.today = new Date(document.getElementById('date-picker').value);
            this.redrawCalendar();
            document.getElementById('date-picker').value = this.today.toISOString().split('T')[0];
        });
    }

    getDaysInPrevMonth(today){
        let lastYear = today.getFullYear();
        let lastMonth = today.getMonth();
        if( lastMonth == 0){
            lastMonth = 11;
            lastYear -=1 ;
        }
        return this.getDaysInMonth(lastYear, lastMonth);
    }

    getDaysInNextMonth(today){
        let nextYear = today.getFullYear();
        let nextMonth = today.getMonth();
        if( nextMonth == 11){
            nextMonth = 0;
            nextYear +=1 ;
        }
        return this.getDaysInMonth(lastYear, lastMonth);
    }

    getDaysInMonth(year, month){
        const days = [];
        const date = new Date(year, month, 1); 
        while (date.getMonth() === month) {
            days.push(new Date(date)); 
            date.setDate(date.getDate() + 1);
        }        
        return days;
    }

}