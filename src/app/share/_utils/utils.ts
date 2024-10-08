import { NgbModalOptions, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
export default class Utils {

  static randomString(parts: number) {
    const stringArr = [];
    for (let i = 0; i < parts; i++) {
      // tslint:disable-next-line:no-bitwise
      const S4 = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      stringArr.push(S4);
    }
    return stringArr.join('-');
  }

  static getStatusName(status: any) {
    var strStatus = "";

    if (status == 'CREATE') {
      strStatus = "Đang thực hiện"
    }
    else if (status == 'CHECK_LIST') {
      strStatus = "Hoàn thành check list"
    } else if (status == 'SUCCESS') {
      strStatus = "Hoàn thành"
    }
    else if (status == 'APPROVE') {
      strStatus = "Hoàn thành"
    }
    else if (status == 'WAIT') {
      strStatus = "Đang sản xuất";
    }
    else if (status == 'REJECT') {
      strStatus = "Từ chối";
    }
    else if (status == 'CANCEL') {
      strStatus = "Hủy";
    }
    else if (status == 'DRAFF') {
      strStatus = "Nháp";
    }
    else if (status == 'WAIT_APPROVE') {
      strStatus = "Chờ phê duyệt";
    } else if (status == 'NOT_APPROVE') {
      strStatus = "Không đạt nhập kho";
    } else if (status == 'CONCESSIONS') {
      strStatus = "Nhân nhượng";
    }

    return strStatus;
  }


  static getStatusApproveName(status: any) {
    var strStatus = "";


    if (status == 'APPROVE') {
      strStatus = "Duyệt"
    }
    else if (status == 'REJECT') {
      strStatus = "Từ chối";
    }
    else if (status == 'CONCESSIONS') {
      strStatus = "Duyệt nhân nhượng";
    }
    else if (status == 'WAIT_APPROVE') {
      strStatus = "Chờ phê duyệt";
    }

    return strStatus;
  }
}
