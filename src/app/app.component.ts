import { Component } from '@angular/core';
import { AuthService } from './share/_services/auth.service';
import { UserService } from './share/_services/user.service';
import { MenuResponse } from './share/response/menu/MenuResponse';
import { Menu } from './share/response/menu/Menu.model';
import { KeycloakService } from 'keycloak-angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // constructor(private authService: AuthService, private userService: UserService, private tokenStorage: KeycloakService) {
  // }
  // tabs: any[] = [
  //   { name: 'Home', route: '' },
  // ];
  // isCollapsed = true;
  // content?: string;
  // menuResponse?: MenuResponse;
  // lstMenuRes?: Menu[];
  // strName?: string;

  // ngOnInit(): void {

  //   if (this.authService.isLoggedIn) {
  //     this.userService.getMenu().subscribe(
  //       data => {
  //         this.menuResponse = JSON.parse(data);
  //         this.lstMenuRes = this.menuResponse?.lstmenu;
  //         console.log('list menu: ', this.lstMenuRes)
  //       },
  //       err => {
  //         this.content = JSON.parse(err.error).message;
  //       }
  //     );

  //     this.strName = this.tokenStorage.getUsername();
  //   }

  // }

  // signOut() {
  //   this.tokenStorage.logout();
  // }


  // -------------------------------------------------------------------------------
  isCollapsed = true; // Trạng thái đóng/mở sidebar
  strName?: string; // Tên người dùng
  lstMenuRes?: Menu[]; // Danh sách menu động
  tabs: { title: string; route: string }[] = [{ title: 'Home', route: '/' }]; // Danh sách tab
  selectedTabIndex = 0; // Tab hiện tại
  loadingTabs: boolean[] = []; // Trạng thái loading cho từng tab

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private tokenStorage: KeycloakService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Kiểm tra trạng thái đăng nhập
    if (this.authService.isLoggedIn) {
      // Lấy danh sách menu từ API
      this.userService.getMenu().subscribe(
        (data) => {
          const menuResponse: MenuResponse = JSON.parse(data);
          this.lstMenuRes = menuResponse?.lstmenu;
          console.log('list menu: ', this.lstMenuRes);
        },
        (err) => {
          console.error('Error fetching menu:', err);
        }
      );

      // Lấy tên người dùng từ Keycloak
      this.strName = this.tokenStorage.getUsername();

      // Điều hướng đến route mặc định "/"
      this.router.navigateByUrl('/');
    }
  }

  /**
   * Mở tab mới hoặc chuyển đến tab đã tồn tại
   * @param title Tiêu đề tab
   * @param route Đường dẫn route
   */
  openTab(title: string, route: string): void {
    // Kiểm tra nếu tab đã tồn tại
    const existingTabIndex = this.tabs.findIndex((tab) => tab.route === route);
    if (existingTabIndex !== -1) {
      // Tab đã tồn tại, chuyển đến tab đó
      this.selectedTabIndex = existingTabIndex;
      return; // Không cần tải lại tab
    }

    // Nếu tab chưa tồn tại, thêm tab mới
    this.tabs.push({ title, route });
    this.loadingTabs.push(true); // Đặt trạng thái loading cho tab mới
    this.selectedTabIndex = this.tabs.length - 1;

    // Giả lập thời gian tải nội dung
    setTimeout(() => {
      this.loadingTabs[this.selectedTabIndex] = false; // Tắt trạng thái loading
      this.router.navigateByUrl(route);
    }, 1000); // Thời gian giả lập 1 giây
  }

  /**
   * Đóng tab
   * @param index Vị trí tab cần đóng
   */
  closeTab(index: number): void {
    this.tabs.splice(index, 1); // Xóa tab khỏi danh sách
    this.loadingTabs.splice(index, 1); // Xóa trạng thái loading của tab
    if (this.selectedTabIndex >= this.tabs.length) {
      this.selectedTabIndex = this.tabs.length - 1; // Chuyển đến tab gần nhất
    }
    const currentTab = this.tabs[this.selectedTabIndex];
    this.router.navigateByUrl(currentTab.route); // Điều hướng đến tab hiện tại
  }

  /**
   * Xử lý khi chuyển đổi tab
   * @param index Vị trí tab được chọn
   */
  onTabChange(index: number): void {
    const currentTab = this.tabs[index];
    this.router.navigateByUrl(currentTab.route); // Điều hướng đến route của tab
  }

  /**
   * Đăng xuất
   */
  signOut(): void {
    this.tokenStorage.logout(); // Gọi hàm logout từ Keycloak
  }

  //--------------------------------------------------------------------------------
}

