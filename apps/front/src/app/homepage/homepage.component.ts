import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { lastValueFrom } from "rxjs";
import { HomepageSetDescriptionComponent } from "./homepage-set-description/homepage-set-description.component";
import { Set } from "@scholarsome/shared";

@Component({
  selector: "scholarsome-view",
  templateUrl: "./homepage.component.html",
  styleUrls: ["./homepage.component.scss"]
})
export class HomepageComponent implements OnInit {
  /**
   * @ignore
   */
  constructor(private http: HttpClient) {}

  @ViewChild("cards", { static: true, read: ViewContainerRef }) cardContainer: ViewContainerRef;
  @ViewChild("container", { static: true }) container: ElementRef;

  @ViewChild("spinner", { static: true }) spinner: ElementRef;

  async ngOnInit(): Promise<void> {
    const sets = await lastValueFrom(this.http.get<Set[]>("/api/sets/user/self"));

    sets.sort((a, b) => {
      return new Date(b.updatedAt).valueOf() - new Date(a.updatedAt).valueOf();
    });

    this.spinner.nativeElement.remove();
    this.container.nativeElement.removeAttribute("hidden");

    for (const set of sets) {
      const setCard = this.cardContainer.createComponent<HomepageSetDescriptionComponent>(HomepageSetDescriptionComponent);

      setCard.instance.title = set.title;
      setCard.instance.description = set.description ? set.description : "";
      setCard.instance.id = set.id;
      setCard.instance.cards = set.cards;
      setCard.instance.private = set.private;
    }
  }
}