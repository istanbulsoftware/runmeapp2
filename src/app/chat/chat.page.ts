import { HttpClient } from "@angular/common/http";
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ActionSheetController, GestureController, AlertController, IonContent, IonFabButton, IonGrid, IonInfiniteScroll, IonTextarea, LoadingController, ModalController, Platform, ToastController } from "@ionic/angular";
import { Socket } from 'ngx-socket-io';
import { take } from "rxjs/operators";
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';

import { FilePath } from '@awesome-cordova-plugins/file-path/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import { JwtHelperService } from "@auth0/angular-jwt";
import { environment } from 'src/environments/environment';
import { NotificationService } from "../notification.service";
import { ShowimagePage } from "../showimage/showimage.page";
import { Location } from "@angular/common";
const helper = new JwtHelperService();
import { Preferences } from '@capacitor/preferences';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { LanguageService } from "../language.service";

const TOKEN_KEY = 'my-token';

@Component({
  selector: "app-chat",
  templateUrl: "./chat.page.html",
  styleUrls: ["./chat.page.scss"],
})
export class ChatPage implements OnInit, OnDestroy {
  tab2 = ['🙈', '🙉', '🙊', '💥', '💫', '💦', '💨', '🐵', '🐒', '🦍', '🦧', '🐶', '🐕', '🦮', '🐕‍🦺', '🐩', '🐺', '🦊', '🦝', '🐱', '🐈', '🐈‍⬛', '🦁', '🐯', '🐅', '🐆', '🐴', '🐎', '🦄', '🦓', '🦌', '🦬', '🐮', '🐂', '🐃', '🐄', '🐷', '🐖', '🐗', '🐽', '🐏', '🐑', '🐐', '🐪', '🐫', '🦙', '🦒', '🐘', '🦣', '🦏', '🦛', '🐭', '🐁', '🐀', '🐹', '🐰', '🐇', '🐿️', '🦫', '🦔', '🦇', '🐻', '🐻‍❄️', '🐨', '🐼', '🦥', '🦦', '🦨', '🦘', '🦡', '🐾', '🦃', '🐔', '🐓', '🐣', '🐤', '🐥', '🐦', '🐧', '🕊️', '🦅', '🦆', '🦢', '🦉', '🦤', '🪶', '🦩', '🦚', '🦜', '🐸', '🐊', '🐢', '🦎', '🐍', '🐲', '🐉', '🦕', '🦖', '🐳', '🐋', '🐬', '🦭', '🐟', '🐠', '🐡', '🦈', '🐙', '🐚', '🐌', '🦋', '🐛', '🐜', '🐝', '🪲', '🐞', '🦗', '🪳', '🕷️', '🕸️', '🦂', '🦟', '🪰', '🪱', '🦠', '💐', '🌸', '💮', '🏵️', '🌹', '🥀', '🌺', '🌻', '🌼', '🌷', '🌱', '🌲', '🌳', '🌴', '🌵', '🌾', '🌿', '☘️', '🍀', '🍁', '🍂', '🍃', '🍄', '🌰', '🦀', '🦞', '🦐', '🦑', '🌍', '🌎', '🌏', '🌐', '🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘', '🌙', '🌚', '🌛', '🌜', '☀️', '🌝', '🌞', '⭐', '🌟', '🌠', '☁️', '⛅', '⛈️', '🌤️', '🌥️', '🌦️', '🌧️', '🌨️', '🌩️', '🌪️', '🌫️', '🌬️', '🌈', '☂️', '☔', '⚡', '❄️', '☃️', '⛄', '☄️', '🔥', '💧', '🌊', '🎄', '✨', '🎋', '🎍']
  tab3 = ['🍇', '🍈', '🍉', '🍊', '🍋', '🍌', '🍍', '🥭', '🍎', '🍏', '🍐', '🍑', '🍒', '🍓', '🫐', '🥝', '🍅', '🫒', '🥥', '🥑', '🍆', '🥔', '🥕', '🌽', '🌶️', '🫑', '🥒', '🥬', '🥦', '🧄', '🧅', '🍄', '🥜', '🌰', '🍞', '🥐', '🥖', '🫓', '🥨', '🥯', '🥞', '🧇', '🧀', '🍖', '🍗', '🥩', '🥓', '🍔', '🍟', '🍕', '🌭', '🥪', '🌮', '🌯', '🫔', '🥙', '🧆', '🥚', '🍳', '🥘', '🍲', '🫕', '🥣', '🥗', '🍿', '🧈', '🧂', '🥫', '🍱', '🍘', '🍙', '🍚', '🍛', '🍜', '🍝', '🍠', '🍢', '🍣', '🍤', '🍥', '🥮', '🍡', '🥟', '🥠', '🥡', '🦪', '🍦', '🍧', '🍨', '🍩', '🍪', '🎂', '🍰', '🧁', '🥧', '🍫', '🍬', '🍭', '🍮', '🍯', '🍼', '🥛', '☕', '🫖', '🍵', '🍶', '🍾', '🍷', '🍸', '🍹', '🍺', '🍻', '🥂', '🥃', '🥤', '🧋', '🧃', '🧉', '🧊', '🥢', '🍽️', '🍴', '🥄']
  tab4 = ['🕴️', '🧗', '🧗‍♂️', '🧗‍♀️', '🤺', '🏇', '⛷️', '🏂', '🏌️', '🏌️‍♂️', '🏌️‍♀️', '🏄', '🏄‍♂️', '🏄‍♀️', '🚣', '🚣‍♂️', '🚣‍♀️', '🏊', '🏊‍♂️', '🏊‍♀️', '⛹️', '⛹️‍♂️', '⛹️‍♀️', '🏋️', '🏋️‍♂️', '🏋️‍♀️', '🚴', '🚴‍♂️', '🚴‍♀️', '🚵', '🚵‍♂️', '🚵‍♀️', '🤸', '🤸‍♂️', '🤸‍♀️', '🤼', '🤼‍♂️', '🤼‍♀️', '🤽', '🤽‍♂️', '🤽‍♀️', '🤾', '🤾‍♂️', '🤾‍♀️', '🤹', '🤹‍♂️', '🤹‍♀️', '🧘', '🧘‍♂️', '🧘‍♀️', '🎪', '🛹', '🛶', '🎗️', '🎟️', '🎫', '🎖️', '🏆', '🏅', '🥇', '🥈', '🥉', '⚽', '⚾', '🥎', '🏀', '🏐', '🏈', '🏉', '🎾', '🥏', '🎳', '🏏', '🏑', '🏒', '🥍', '🏓', '🏸', '🥊', '🥋', '🥅', '⛳', '⛸️', '🎣', '🎽', '🎿', '🛷', '🥌', '🎯', '🎱', '🎮', '🎰', '🎲', '🧩', '♟️', '🎭', '🎨', '🧵', '🧶', '🎼', '🎤', '🎧', '🎷', '🪗', '🎸', '🎹', '🎺', '🎻', '🥁', '🪘', '🎬', '🏹']
  tab5 = ['🚣', '🗾', '🏔️', '⛰️', '🌋', '🗻', '🏕️', '🏖️', '🏜️', '🏝️', '🏞️', '🏟️', '🏛️', '🏗️', '🛖', '🏘️', '🏚️', '🏠', '🏡', '🏢', '🏣', '🏤', '🏥', '🏦', '🏨', '🏩', '🏪', '🏫', '🏬', '🏭', '🏯', '🏰', '💒', '🗼', '🗽', '⛪', '🕌', '🛕', '🕍', '⛩️', '🕋', '⛲', '⛺', '🌁', '🌃', '🏙️', '🌄', '🌅', '🌆', '🌇', '🌉', '🎠', '🎡', '🎢', '🚂', '🚃', '🚄', '🚅', '🚆', '🚇', '🚈', '🚉', '🚊', '🚝', '🚞', '🚋', '🚌', '🚍', '🚎', '🚐', '🚑', '🚒', '🚓', '🚔', '🚕', '🚖', '🚗', '🚘', '🚙', '🛻', '🚚', '🚛', '🚜', '🏎️', '🏍️', '🛵', '🛺', '🚲', '🛴', '🚏', '🛣️', '🛤️', '⛽', '🚨', '🚥', '🚦', '🚧', '⚓', '⛵', '🚤', '🛳️', '⛴️', '🛥️', '🚢', '✈️', '🛩️', '🛫', '🛬', '🪂', '💺', '🚁', '🚟', '🚠', '🚡', '🛰️', '🚀', '🛸', '🪐', '🌠', '🌌', '⛱️', '🎆', '🎇', '🎑', '💴', '💵', '💶', '💷', '🗿', '🛂', '🛃', '🛄', '🛅']
  tab6 = ['💌', '🕳️', '💣', '🛀', '🛌', '🔪', '🏺', '🗺️', '🧭', '🧱', '💈', '🦽', '🦼', '🛢️', '🛎️', '🧳', '⌛', '⏳', '⌚', '⏰', '⏱️', '⏲️', '🕰️', '🌡️', '⛱️', '🧨', '🎈', '🎉', '🎊', '🎎', '🎏', '🎐', '🧧', '🎀', '🎁', '🤿', '🪀', '🪁', '🔮', '🧿', '🕹️', '🧸', '🪆', '🖼️', '🧵', '🪡', '🧶', '🛍️', '📿', '💎', '📯', '🎙️', '🎚️', '🎛️', '📻', '🪕', '📱', '📲', '☎️', '📞', '📟', '📠', '🔋', '🔌', '💻', '🖥️', '🖨️', '⌨️', '🖱️', '🖲️', '💽', '💾', '💿', '📀', '🧮', '🎥', '🎞️', '📽️', '📺', '📷', '📸', '📹', '📼', '🔍', '🔎', '🕯️', '💡', '🔦', '🏮', '🪔', '📔', '📕', '📖', '📗', '📘', '📙', '📚', '📓', '📒', '📃', '📜', '📄', '📰', '🗞️', '📑', '🔖', '🏷️', '💰', '🪙', '💴', '💵', '💶', '💷', '💸', '💳', '🧾', '✉️', '📧', '📨', '📩', '📤', '📥', '📦', '📫', '📪', '📬', '📭', '📮', '🗳️', '✏️', '✒️', '🖋️', '🖊️', '🖌️', '🖍️', '📝', '📁', '📂', '🗂️', '📅', '📆', '🗒️', '🗓️', '📇', '📈', '📉', '📊', '📋', '📌', '📍', '📎', '🖇️', '📏', '📐', '✂️', '🗃️', '🗄️', '🗑️', '🔒', '🔓', '🔏', '🔐', '🔑', '🗝️', '🔨', '🪓', '⛏️', '⚒️', '🛠️', '🗡️', '⚔️', '🔫', '🛡️', '🪚', '🔧', '🪛', '🔩', '⚙️', '🗜️', '⚖️', '🦯', '🔗', '⛓️', '🪝', '🧰', '🧲', '🪜', '⚗️', '🧪', '🧫', '🧬', '🔬', '🔭', '📡', '💉', '🩸', '💊', '🩹', '🩺', '🚪', '🛏️', '🛋️', '🪑', '🚽', '🪠', '🚿', '🛁', '🪤', '🪒', '🧴', '🧷', '🧹', '🧺', '🧻', '🪣', '🧼', '🪥', '🧽', '🧯', '🛒', '🚬', '⚰️', '⚱️', '🗿', '🚰']
  tab7 = ['💘', '💝', '💖', '💗', '💓', '💞', '💕', '💟', '❣️', '💔', '❤️', '🧡', '💛', '💚', '💙', '💜', '🤎', '🖤', '🤍', '💯', '💢', '💬', '👁️‍🗨️', '🗨️', '🗯️', '💭', '💤', '💮', '♨️', '💈', '🛑', '🕛', '🕧', '🕐', '🕜', '🕑', '🕝', '🕒', '🕞', '🕓', '🕟', '🕔', '🕠', '🕕', '🕡', '🕖', '🕢', '🕗', '🕣', '🕘', '🕤', '🕙', '🕥', '🕚', '🕦', '🌀', '♠️', '♥️', '♦️', '♣️', '🃏', '🀄', '🎴', '🔇', '🔈', '🔉', '🔊', '📢', '📣', '📯', '🔔', '🔕', '🎵', '🎶', '💹', '🏧', '🚮', '🚰', '♿', '🚹', '🚺', '🚻', '🚼', '🚾', '⚠️', '🚸', '⛔', '🚫', '🚳', '🚭', '🚯', '🚱', '🚷', '📵', '🔞', '☢️', '☣️', '⬆️', '↗️', '➡️', '↘️', '⬇️', '↙️', '⬅️', '↖️', '↕️', '↔️', '↩️', '↪️', '⤴️', '⤵️', '🔃', '🔄', '🔙', '🔚', '🔛', '🔜', '🔝', '🛐', '⚛️', '🕉️', '✡️', '☸️', '☯️', '✝️', '☦️', '☪️', '☮️', '🕎', '🔯', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '⛎', '🔀', '🔁', '🔂', '▶️', '⏩', '⏭️', '⏯️', '◀️', '⏪', '⏮️', '🔼', '⏫', '🔽', '⏬', '⏸️', '⏹️', '⏺️', '⏏️', '🎦', '🔅', '🔆', '📶', '📳', '📴', '♀️', '♂️', '✖️', '➕', '➖', '➗', '♾️', '‼️', '⁉️', '❓', '❔', '❕', '❗', '〰️', '💱', '💲', '⚕️', '♻️', '⚜️', '🔱', '📛', '🔰', '⭕', '✅', '☑️', '✔️', '❌', '❎', '➰', '➿', '〽️', '✳️', '✴️', '❇️', '©️', '®️', '™️', '#️⃣', '*️⃣', '0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '🔠', '🔡', '🔢', '🔣', '🔤', '🅰️', '🆎', '🅱️', '🆑', '🆒', '🆓', 'ℹ️', '🆔', 'Ⓜ️', '🆕', '🆖', '🅾️', '🆗', '🅿️', '🆘', '🆙', '🆚', '🈁', '🈂️', '🈷️', '🈶', '🈯', '🉐', '🈹', '🈚', '🈲', '🉑', '🈸', '🈴', '🈳', '㊗️', '㊙️', '🈺', '🈵', '🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '🟤', '⚫', '⚪', '🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '🟫', '⬛', '⬜', '◼️', '◻️', '◾', '◽', '▪️', '▫️', '🔶', '🔷', '🔸', '🔹', '🔺', '🔻', '💠', '🔘', '🔳', '🔲']
  tab8 = ['🏁', '🚩', '🎌', '🏴', '🏳️', '🏳️‍🌈', '🏳️‍⚧️', '🏴‍☠️', '🇦🇨', '🇦🇩', '🇦🇪', '🇦🇫', '🇦🇬', '🇦🇮', '🇦🇱', '🇦🇲', '🇦🇴', '🇦🇶', '🇦🇷', '🇦🇸', '🇦🇹', '🇦🇺', '🇦🇼', '🇦🇽', '🇦🇿', '🇧🇦', '🇧🇧', '🇧🇩', '🇧🇪', '🇧🇫', '🇧🇬', '🇧🇭', '🇧🇮', '🇧🇯', '🇧🇱', '🇧🇲', '🇧🇳', '🇧🇴', '🇧🇶', '🇧🇷', '🇧🇸', '🇧🇹', '🇧🇻', '🇧🇼', '🇧🇾', '🇧🇿', '🇨🇦', '🇨🇨', '🇨🇩', '🇨🇫', '🇨🇬', '🇨🇭', '🇨🇮', '🇨🇰', '🇨🇱', '🇨🇲', '🇨🇳', '🇨🇴', '🇨🇵', '🇨🇷', '🇨🇺', '🇨🇻', '🇨🇼', '🇨🇽', '🇨🇾', '🇨🇿', '🇩🇪', '🇩🇬', '🇩🇯', '🇩🇰', '🇩🇲', '🇩🇴', '🇩🇿', '🇪🇦', '🇪🇨', '🇪🇪', '🇪🇬', '🇪🇭', '🇪🇷', '🇪🇸', '🇪🇹', '🇪🇺', '🇫🇮', '🇫🇯', '🇫🇰', '🇫🇲', '🇫🇴', '🇫🇷', '🇬🇦', '🇬🇧', '🇬🇩', '🇬🇪', '🇬🇫', '🇬🇬', '🇬🇭', '🇬🇮', '🇬🇱', '🇬🇲', '🇬🇳', '🇬🇵', '🇬🇶', '🇬🇷', '🇬🇸', '🇬🇹', '🇬🇺', '🇬🇼', '🇬🇾', '🇭🇰', '🇭🇲', '🇭🇳', '🇭🇷', '🇭🇹', '🇭🇺', '🇮🇨', '🇮🇩', '🇮🇪', '🇮🇱', '🇮🇲', '🇮🇳', '🇮🇴', '🇮🇶', '🇮🇷', '🇮🇸', '🇮🇹', '🇯🇪', '🇯🇲', '🇯🇴', '🇯🇵', '🇰🇪', '🇰🇬', '🇰🇭', '🇰🇮', '🇰🇲', '🇰🇳', '🇰🇵', '🇰🇷', '🇰🇼', '🇰🇾', '🇰🇿', '🇱🇦', '🇱🇧', '🇱🇨', '🇱🇮', '🇱🇰', '🇱🇷', '🇱🇸', '🇱🇹', '🇱🇺', '🇱🇻', '🇱🇾', '🇲🇦', '🇲🇨', '🇲🇩', '🇲🇪', '🇲🇫', '🇲🇬', '🇲🇭', '🇲🇰', '🇲🇱', '🇲🇲', '🇲🇳', '🇲🇴', '🇲🇵', '🇲🇶', '🇲🇷', '🇲🇸', '🇲🇹', '🇲🇺', '🇲🇻', '🇲🇼', '🇲🇽', '🇲🇾', '🇲🇿', '🇳🇦', '🇳🇨', '🇳🇪', '🇳🇫', '🇳🇬', '🇳🇮', '🇳🇱', '🇳🇴', '🇳🇵', '🇳🇷', '🇳🇺', '🇳🇿', '🇴🇲', '🇵🇦', '🇵🇪', '🇵🇫', '🇵🇬', '🇵🇭', '🇵🇰', '🇵🇱', '🇵🇲', '🇵🇳', '🇵🇷', '🇵🇸', '🇵🇹', '🇵🇼', '🇵🇾', '🇶🇦', '🇷🇪', '🇷🇴', '🇷🇸', '🇷🇺', '🇷🇼', '🇸🇦', '🇸🇧', '🇸🇨', '🇸🇩', '🇸🇪', '🇸🇬', '🇸🇭', '🇸🇮', '🇸🇯', '🇸🇰', '🇸🇱', '🇸🇲', '🇸🇳', '🇸🇴', '🇸🇷', '🇸🇸', '🇸🇹', '🇸🇻', '🇸🇽', '🇸🇾', '🇸🇿', '🇹🇦', '🇹🇨', '🇹🇩', '🇹🇫', '🇹🇬', '🇹🇭', '🇹🇯', '🇹🇰', '🇹🇱', '🇹🇲', '🇹🇳', '🇹🇴', '🇹🇷', '🇹🇹', '🇹🇻', '🇹🇼', '🇹🇿', '🇺🇦', '🇺🇬', '🇺🇲', '🇺🇳', '🇺🇸', '🇺🇾', '🇺🇿', '🇻🇦', '🇻🇨', '🇻🇪', '🇻🇬', '🇻🇮', '🇻🇳', '🇻🇺', '🇼🇫', '🇼🇸', '🇽🇰', '🇾🇪', '🇾🇹', '🇿🇦', '🇿🇲', '🇿🇼', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '🏴󠁧󠁢󠁳󠁣󠁴󠁿', '🏴󠁧󠁢󠁷󠁬󠁳󠁿', '🏴󠁵󠁳󠁴󠁸󠁿']
  tab1 = ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '☺️', '😚', '😙', '🥲', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '🥸', '😎', '🤓', '🧐', '😕', '😟', '🙁', '☹️', '😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈', '👿', '💀', '☠️', '💩', '🤡', '👹', '👺', '👻', '👽', '👾', '🤖', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '💋', '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🦷', '🦴', '👀', '👁️', '👅', '👄', '👶', '🧒', '👦', '👧', '🧑', '👱', '👨', '🧔', '👨‍🦰', '👨‍🦱', '👨‍🦳', '👨‍🦲', '👩', '👩‍🦰', '🧑‍🦰', '👩‍🦱', '🧑‍🦱', '👩‍🦳', '🧑‍🦳', '👩‍🦲', '🧑‍🦲', '👱‍♀️', '👱‍♂️', '🧓', '👴', '👵', '🙍', '🙍‍♂️', '🙍‍♀️', '🙎', '🙎‍♂️', '🙎‍♀️', '🙅', '🙅‍♂️', '🙅‍♀️', '🙆', '🙆‍♂️', '🙆‍♀️', '💁', '💁‍♂️', '💁‍♀️', '🙋', '🙋‍♂️', '🙋‍♀️', '🧏', '🧏‍♂️', '🧏‍♀️', '🙇', '🙇‍♂️', '🙇‍♀️', '🤦', '🤦‍♂️', '🤦‍♀️', '🤷', '🤷‍♂️', '🤷‍♀️', '🧑‍⚕️', '👨‍⚕️', '👩‍⚕️', '🧑‍🎓', '👨‍🎓', '👩‍🎓', '🧑‍🏫', '👨‍🏫', '👩‍🏫', '🧑‍⚖️', '👨‍⚖️', '👩‍⚖️', '🧑‍🌾', '👨‍🌾', '👩‍🌾', '🧑‍🍳', '👨‍🍳', '👩‍🍳', '🧑‍🔧', '👨‍🔧', '👩‍🔧', '🧑‍🏭', '👨‍🏭', '👩‍🏭', '🧑‍💼', '👨‍💼', '👩‍💼', '🧑‍🔬', '👨‍🔬', '👩‍🔬', '🧑‍💻', '👨‍💻', '👩‍💻', '🧑‍🎤', '👨‍🎤', '👩‍🎤', '🧑‍🎨', '👨‍🎨', '👩‍🎨', '🧑‍✈️', '👨‍✈️', '👩‍✈️', '🧑‍🚀', '👨‍🚀', '👩‍🚀', '🧑‍🚒', '👨‍🚒', '👩‍🚒', '👮', '👮‍♂️', '👮‍♀️', '🕵️', '🕵️‍♂️', '🕵️‍♀️', '💂', '💂‍♂️', '💂‍♀️', '👷', '👷‍♂️', '👷‍♀️', '🤴', '👸', '👳', '👳‍♂️', '👳‍♀️', '👲', '🧕', '🤵', '👰', '🤰', '🤱', '🧑‍🍼', '👼', '🎅', '🤶', '🦸', '🦸‍♂️', '🦸‍♀️', '🦹', '🦹‍♂️', '🦹‍♀️', '🧙', '🧙‍♂️', '🧙‍♀️', '🧚', '🧚‍♂️', '🧚‍♀️', '🧛', '🧛‍♂️', '🧛‍♀️', '🧜', '🧜‍♂️', '🧜‍♀️', '🧝', '🧝‍♂️', '🧝‍♀️', '🧞', '🧞‍♂️', '🧞‍♀️', '🧟', '🧟‍♂️', '🧟‍♀️', '💆', '💆‍♂️', '💆‍♀️', '💇', '💇‍♂️', '💇‍♀️', '🚶', '🚶‍♂️', '🚶‍♀️', '🧍', '🧍‍♂️', '🧍‍♀️', '🧎', '🧎‍♂️', '🧎‍♀️', '🧑‍🦯', '👨‍🦯', '👩‍🦯', '🧑‍🦼', '👨‍🦼', '👩‍🦼', '🧑‍🦽', '👨‍🦽', '👩‍🦽', '🏃', '🏃‍♂️', '🏃‍♀️', '💃', '🕺', '🕴️', '👯', '👯‍♂️', '👯‍♀️', '🧖', '🧖‍♂️', '🧖‍♀️', '🧘', '🧑‍🤝‍🧑', '👭', '👫', '👬', '💏', '👩‍❤️‍💋‍👨', '👨‍❤️‍💋‍👨', '👩‍❤️‍💋‍👩', '💑', '👩‍❤️‍👨', '👨‍❤️‍👨', '👩‍❤️‍👩', '👪', '👨‍👩‍👦', '👨‍👩‍👧', '👨‍👩‍👧‍👦', '👨‍👩‍👦‍👦', '👨‍👩‍👧‍👧', '👨‍👨‍👦', '👨‍👨‍👧', '👨‍👨‍👧‍👦', '👨‍👨‍👦‍👦', '👨‍👨‍👧‍👧', '👩‍👩‍👦', '👩‍👩‍👧', '👩‍👩‍👧‍👦', '👩‍👩‍👦‍👦', '👩‍👩‍👧‍👧', '👨‍👦', '👨‍👦‍👦', '👨‍👧', '👨‍👧‍👦', '👨‍👧‍👧', '👩‍👦', '👩‍👦‍👦', '👩‍👧', '👩‍👧‍👦', '👩‍👧‍👧', '🗣️', '👤', '👥', '👣', '🧳', '🌂', '☂️', '🎃', '🧵', '🧶', '👓', '🕶️', '🥽', '🥼', '🦺', '👔', '👕', '👖', '🧣', '🧤', '🧥', '🧦', '👗', '👘', '🥻', '🩱', '🩲', '🩳', '👙', '👚', '👛', '👜', '👝', '🎒', '👞', '👟', '🥾', '🥿', '👠', '👡', '🩰', '👢', '👑', '👒', '🎩', '🎓', '🧢', '⛑️', '💄', '💍', '💼', '🩸']

  options: CameraOptions = {
    quality: 50,
    allowEdit: false,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    mediaType: this.camera.MediaType.PICTURE,
    destinationType: this.camera.DestinationType.FILE_URI
  };
  cameraOptions: CameraOptions = {
    quality: 50,
    allowEdit: false,
    sourceType: this.camera.PictureSourceType.CAMERA,
    mediaType: this.camera.MediaType.PICTURE,
    destinationType: this.camera.DestinationType.FILE_URI
  };

  optionsvideo: CameraOptions = {
    quality: 50,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    destinationType: this.camera.DestinationType.FILE_URI,
    mediaType: this.camera.MediaType.VIDEO,
    correctOrientation: true,
    saveToPhotoAlbum: false,
    targetHeight: 512,
    targetWidth: 512,
  };

  userLocation: { lat: number, lng: number } = { lat: null, lng: null }
  locationAccess = true
  toggled = false;
  selectedCategory = "tab1";
  myId
  id: string;
  isLoading = true;
  other = false;
  form;
  convId
  name = ''
  profileimg = ''
  messages: any[] = []
  newMessages: any[] = []
  isScrolled = false
  nowdate: Date = new Date()
  @ViewChild(IonTextarea) textArea;
  @ViewChild(IonContent) chatContent;
  is_online: string

  @ViewChild('recordBtn', { read: ElementRef }) recordBtn: ElementRef
  duratin: number
  durationDisplay: string = ""
  isRecording: boolean = false
  getLang: string
  myCoins: number
  userInfo : any
  constructor(
    private camera: Camera,
    private platform: Platform,

    private loadingCtrl: LoadingController,
    private socket: Socket,
    private activeRoute: ActivatedRoute,
    private http: HttpClient,
    private filePath: FilePath,
    private fileTrans: FileTransfer,

    private actionSheetController: ActionSheetController,
    private toastController: ToastController,
    private router: Router,
    private notifi: NotificationService,
    private modalController: ModalController,
    private gestureController: GestureController,

    private location: Location,
    private alertController: AlertController,
    private langService: LanguageService

  ) {
    this.duratin = 0
    this.getCoins()
    this.loadToken();

    Preferences.get({ key: TOKEN_KEY }).then(token => {
      if (token && token.value) {
        const a = helper.decodeToken(token.value);
        this.myId = a.id
      }
    })

    this.form = new FormGroup({
      message: new FormControl(null, {
        updateOn: "change",
        validators: [Validators.required],
      }),
    });

    this.activeRoute.queryParams.pipe(take(1)).subscribe(query => {
      this.convId = query.convId;
      this.notifi.decrease(query.convId)
      this.name = query.name;
      this.profileimg = query.profileimg;
    });
    console.log(this.profileimg);


    this.activeRoute.params.pipe(take(1)).subscribe((params) => {
      if (params && params.id) {
        this.id = params.id;


        this.socket.on('comeonline', (data) => {

          console.log(data);
          this.is_online = data
        })
        this.socket.on('leftbyuser', (data) => {
          console.log(data);
          this.is_online = data
        })


        this.http.post(`${environment.url}/get-messages2`, { convId: this.convId, skip: this.messages.length }).subscribe(
          (res: any) => {
            console.log(res);

            this.messages = res.messages.messages;
            setTimeout(() => {
              this.chatContent.scrollToBottom(500);

            }, 200);
          },
          (err) => { this.presentToast("Hata oluştu lütfen tekrar deneyin") }
        )

        this.socket.emit('joinChat', { roomId: this.convId });
        this.socket.on('removedBlockedUser', (data) => {
          if (data && data.user1 && data.user2) {
            this.checkBlock()
          }
        })
        this.socket.on('newBlockedUser', (data) => {
          if (data && data.user1 && data.user2) {
            if (data.user1 == this.myId && data.user2 == this.id || data.user2 == this.myId && data.user1 == this.id) {
              this.checkBlock()
            }
          }
        })
        this.socket.on('convDeleted', (data) => {
          console.log(data)
          if (data && data.convId && data.convId == this.convId) {
            this.router.navigateByUrl('/tabs/tab1')
            this.presentToast('This Conversation Has Been Deleted by a User');
          }
        })
        this.socket.on('newPrivateMessage', (data) => {
          console.log(data);

          if (data && data._id && data.senderId && data.message) {
            this.newMessages.push(data);
            if (!this.isScrolled) {
              setTimeout(() => { this.chatContent.scrollToBottom(300); }, 100);
            }

          }
        })
        this.socket.on('gelencevap', (data) => {
          console.log(data);
        })

      }
    });
  }

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  @ViewChild(IonGrid) myGrid;

  onScroll(e) {
    console.log(((e.currentY + this.chatContent.el.clientHeight) - this.myGrid.el.clientHeight) > -500)
    const myFab = document.getElementById('scroll-to-bottom-btn');
    if (((e.currentY + this.chatContent.el.clientHeight) - this.myGrid.el.clientHeight) > -500) {
      myFab.classList.remove('show');
      myFab.classList.add('hide');
      this.isScrolled = false
    }
    else {
      myFab.classList.remove('hide');
      myFab.classList.add('show');
      this.isScrolled = true
    }
  }

  onScrollToBottom() {
    this.chatContent.scrollToBottom(300);
  }

  loadData(event) {
    setTimeout(() => {
      this.http.post(`${environment.url}/get-messages2`, { convId: this.convId, skip: (this.messages.length + this.newMessages.length) }).subscribe(
        (res: any) => {
          console.log(res.messages.messages);
          if (res.messages.messages.length < 1) {
            event.target.disabled = true;
          }
          else {
            this.messages = this.messages.concat(res.messages.messages)
            //this.messages.push(res.messages.messages);
            console.log(this.messages)
            event.target.complete();
          }
        },
        (err) => {
          event.target.complete();
          this.presentToast("Hata oluştu lütfen tekrar deneyin");
        }
      )


    }, 500);
  }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }

  get message() {
    return this.form.get("message");
  }

  showDate(id) {
    console.log('clicked')
    const a = document.getElementById(id);
    console.log(a)
    a.classList.toggle('show2')
  }

  ionViewWillEnter() {
    this.checkBlock()
  }


  ionViewDidEnter() {
    this.getLang = this.langService.getLanguage()
    const a = document.documentElement;
    const b = document.getElementById('sendIcon');
    b.dir = a.dir;
    this.chatContent.scrollToBottom(300);
    try {
      this.textArea.setFocus();
    } catch (error) {
    }
  }

  onFocus() {
    if (!this.isScrolled) {
      setTimeout(() => { this.chatContent.scrollToBottom(300); }, 1000);
    }
  }

  addEmoji(event) {
    if (this.form.value.message) {
      this.form.controls.message.setValue(this.form.value.message + event);
    } else {
      this.form.controls.message.setValue(event);
    }

    //this.message += event.char;
  }
  handleCharDelete() {
    if (this.form.value.message) {
      this.form.controls.message.setValue(
        this.form.value.message.substr(0, this.form.value.message.length - 2)
      );
    }
  }

  isBlocked = false
  ngOnInit() {
    if (this.id && this.myId) { this.checkBlock() }
    if (this.id && this.myId) { this.checkBlock() }

    this.http.get(`${environment.url}/profile/${this.id}`).pipe(take(1)).subscribe((user: any) => {
      console.log(user);

      this.userInfo = user

      this.userInfo.profilePicture = user.profilePicture







    },
      (err) => {
        this.presentToast(err.message);
      }
    );

  }
  token
  async loadToken() {
    const token = await Preferences.get({ key: TOKEN_KEY });
    if (token && token.value) { this.token = token.value; }
  }

  ngOnDestroy() {
    this.socket.emit('leaveChat', { roomId: this.convId });
  }

  user2
  extraData = []
  blockedBefore = false
  checkBlock() {
    this.http.post(`${environment.url}/check-blocked-user`, { user1: this.myId, user2: this.id }).subscribe(
      (res: any) => {
        console.log(res.extraData)
        if (res && res.checked) {
          this.isBlocked = res.checked;
          if (res.extraData.length < 0) { this.blockedBefore = false }
          else if (res.extraData.length == 1) {
            if (res.extraData[0].user1 == this.myId && res.extraData[0].user2 == this.id) { this.blockedBefore = true }
          }
          else if (res.extraData.length == 2) { this.blockedBefore = true }
        }
      },
      (err) => { this.isBlocked = false }
    )
  }

  onMore() {
    this.presentActionSheet();
  }

  async decCoins(quantity) {
    this.http.post(`${environment.url}/dec-coin`, { quantity: quantity }).subscribe(
      (res: any) => {
        this.myCoins = res.trueCoins


      },
      // err=>{this.presentToast("Hata oluştu lütfen tekrar deneyin"); loading.dismiss()}
    )
  }

  onSendMessage() {

      if (this.form.value.message.trim().length > 0) {
        this.socket.emit('newMessagewithimg', { roomId: this.convId, senderId: this.myId, message: this.form.value.message, mesType: 'text', mesTime: new Date(+new Date() + (15 * 86400000)) });
        this.form.controls.message.setValue('')
        this.textArea.setFocus();
      //  this.decCoins(10)
      //  this.myCoins = this.myCoins - 10
      }
    
  }

  async getCoins() {
    this.http.get(`${environment.url}/get-my-coins`).subscribe(
      (res: any) => {
        this.myCoins = res.trueCoins


      },
      // err=>{this.presentToast("Hata oluştu lütfen tekrar deneyin"); loading.dismiss()}
    )
  }

  async presentToast(m: string) {
    const toast = await this.toastController.create({
      message: m,
      duration: 2000
    });
    toast.present();
  }

  gotorpfie() {
    this.router.navigateByUrl(`/profile/${this.id}`)
  }
  async presentActionSheet() {
    const actionSheet2 = await this.actionSheetController.create({
      mode: 'md',
      buttons: [
        {
          text: 'Profile git',
          icon: 'person',
          handler: () => {
            this.router.navigateByUrl(`/profile/${this.id}`)
          }
        }, {
          text: 'Engelle',
          icon: 'hand-left',
          handler: () => {
            if (this.blockedBefore) { }
            else if (!this.blockedBefore) {
              this.http.post(`${environment.url}/block-new-user`, { user1: this.myId, user2: this.id }).subscribe(
                (res: any) => { this.presentToast('İşlem gerçekleşti'); this.checkBlock() },
                (err) => { this.presentToast('') }
              )
            }
          }
        }
      ]
    });

    await actionSheet2.present();


  }



  onImageSelect(): Promise<any> {
    return this.camera.getPicture(this.options)
      .then(async (fileUri) => {
        const loading = await this.loadingCtrl.create();
        await loading.present();

        if (this.platform.is('ios')) {
          await loading.dismiss()
          return fileUri;
        } else if (this.platform.is('android')) {
          fileUri = 'file://' + fileUri;
          await loading.dismiss()
          return fileUri;
        }
      })
      .then((path) => {
        this.uploadImage(path, 'image');
        return path;
      }).catch(err => { this.presentToast(JSON.stringify(err)) })
  }




  onVideoSelect(): Promise<any> {
    return this.camera.getPicture(this.optionsvideo)
      .then(async (fileUri) => {
        const loading = await this.loadingCtrl.create();
        await loading.present();

        if (this.platform.is('ios')) {
          await loading.dismiss()
          return fileUri;
        } else if (this.platform.is('android')) {
          fileUri = 'file://' + fileUri;
          await loading.dismiss()
          return fileUri;
        }
      })
      .then((path) => {
        this.uploadImage(path, 'video');
        return path;
      }).catch(err => { this.presentAlert("4" + JSON.stringify(err)) })
  }





  async beSubscribed(mes) {
    this.router.navigateByUrl('/walletsubs')
  }

  onCameraSelect(): Promise<any> {
    return this.camera.getPicture(this.cameraOptions)
      .then(async (fileUri) => {
        const loading = await this.loadingCtrl.create();
        await loading.present();

        if (this.platform.is('ios')) {
          await loading.dismiss()
          return fileUri;
        } else if (this.platform.is('android')) {
          fileUri = 'file://' + fileUri;
          await loading.dismiss()
          return fileUri;
        }
      })
      .then((path) => {
        this.uploadImage(path, 'image');
        return path;
      }).catch(err => { this.presentToast(err) })
  }



  async presentUploadActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: '',
      buttons: [{
        text: 'Yeni fotoğraf çek',
        icon: 'camera',
        handler: () => {
          this.onCameraSelect();
        }
      }, {
        text: 'Galeriden fotoğraf gönder',
        icon: 'image',
        handler: () => {
          this.onImageSelect();
        }
      }
      ]
    });
    await actionSheet.present();
  }




  testfunc() {
    this.socket.emit('newMessagewithimg', { roomId: this.convId, senderId: this.myId, message: this.userLocation.lat + '-----' + this.userLocation.lng, mesType: 'location' });
  }


  sendVoice() {
    this.http.post(`${environment.url}/senttest`, { testdata: 'sentdata', senderId: this.myId }).subscribe(
      (res: any) => {
        console.log(res)
      },
      (err) => {
        console.log(err)
      }
    )
  }

  // async presentModal(mes) {

  //    var getloc = mes
  //   var splitted = getloc.split("-----", 2); 
  //   var getltd = Number(splitted[0])
  //   var getlng = Number(splitted[1])
  //   // window.open('geo:'+getltd+','+ getlng, '_system'); 
  //    window.open("geo:" + getltd + ',' + getlng + "?z=15"); 
  // }



  async openIpmagemodal(image) {
    const modal = await this.modalController.create({
      component: ShowimagePage,
      componentProps: { imagename: image }
    });
    await modal.present();
    const data = await modal.onDidDismiss();
  }


  fileTransObj: FileTransferObject;
  async uploadImage(path, metypeval) {
    const loading = await this.loadingCtrl.create({
      duration: 2500,
      mode: 'ios'
    });
    await loading.present();
    this.filePath.resolveNativePath(path).then(nativePath => {
      this.fileTransObj = this.fileTrans.create();
      const fPath = path.split('?')[0];
      const name = fPath.substring(fPath.lastIndexOf("/") + 1);

      let options: FileUploadOptions = {
        fileKey: 'file',
        fileName: 'ss.mp4',
        chunkedMode: false,
        headers: { 'Authorization': `Bearer ${this.token}` },
        mimeType: 'image/jpeg',
        params: { roomId: this.convId, senderId: this.myId, message: 'resimmmm', mesType: metypeval }
      }

      this.fileTransObj.upload(nativePath, `${environment.url}/message/add`, options)
        .then(
          async (res) => {
            //  this.onSendMessage()
            // this.syncPhotos();
            this.presentToast('Photo Added Successfully')
            await loading.dismiss()

          },
          async (err) => {
            await loading.dismiss().then(() => { this.presentToast(err.message) })
          }
        )

    }).catch(err => this.presentToast(err.message));
  }

  async uploadDocument(path) {
    const loading = await this.loadingCtrl.create({
      duration: 2000,
      mode: 'ios'
    }); await loading.present();
    this.filePath.resolveNativePath(path).then(nativePath => {
      this.fileTransObj = this.fileTrans.create();
      const fPath = path.split('?')[0];
      const name = fPath.substring(fPath.lastIndexOf("/") + 1);
      const fileExtension = fPath.substr(fPath.lastIndexOf('/') + 1);
      let options: FileUploadOptions = {
        fileKey: 'file',
        fileName: name,
        chunkedMode: false,
        headers: { 'Authorization': `Bearer ${this.token}` },
        params: { roomId: this.convId, senderId: this.myId, message: 'resimmmm', mesType: fileExtension }
      }

      this.fileTransObj.upload(nativePath, `${environment.url}/message/add`, options)
        .then(
          async (res) => {
            //  this.onSendMessage()
            // this.syncPhotos();
            //this.presentToast('File Added Successfully')
            await loading.dismiss()

          },
          async (err) => {
            await loading.dismiss().then(() => { this.presentToast(err.message) })
          }
        )

    }).catch(err => this.presentToast(err.message));
  }

  onTime() {
    document.getElementById('nextmessage').classList.remove("ion-hide");
    document.getElementById('nextmessage').classList.add("ion-show");
  }
  onTimeClose() {
    document.getElementById('nextmessage').classList.add("ion-hide");
    document.getElementById('nextmessage').classList.remove("ion-show");
  }

  myBackButton() {
    this.location.back()
  }
  async presentAlert(m) {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'Important message',
      message: m,
      buttons: ['OK'],
    });

    await alert.present();
  }


  //voice 



  calculateDuratin() {
    if (!this.isRecording) {
      this.duratin = 0
      this.durationDisplay = ""
      return
    }
    this.duratin += 1
    if (this.duratin === 20) {
      this.stopRecording()
    }

    const seconds = (this.duratin % 60).toString().padStart(2, '0');
    this.durationDisplay = seconds;
    setTimeout(() => {
      this.calculateDuratin()
    }, 1000)
  }
  stopRecording() {
    if (!this.isRecording) {
      return
    }

  }


}
