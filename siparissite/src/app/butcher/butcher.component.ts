import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-butcher',
  templateUrl: './butcher.component.html',
  styleUrls: ['./butcher.component.css']
})
export class ButcherComponent implements OnInit {

  all_questions:any;

  constructor(private http: HttpClient) {
    this.get_questions();
  }

  ngOnInit(): void {
  }

  get_questions() {
    this.http.get("http://localhost:5000/questions/").subscribe((data:any) =>{
      console.log(data); 
      this.all_questions = data.database
    })
  }
}
