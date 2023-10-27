package main

import (
	"errors"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/jszwec/csvutil"
	"math/rand"
	"os"
	"path/filepath"
	"strings"
	"time"
)

var dbFile string

type kv struct {
	K string `csv:"k"`
	V string `csv:"v"`
}

func main() {

	rand.Seed(time.Now().UnixNano())

	fmt.Println(os.Getenv("FC_SERVICE_NAME"))
	fmt.Println(os.Getenv("FC_FUNCTION_NAME"))

	accountID := os.Getenv("FC_ACCOUNT_ID")

	dbFile = filepath.Join("/mnt/auto", fmt.Sprintf("db-%s.csv", os.Getenv("FC_SERVICE_NAME")))

	if _, err := os.Stat(dbFile); errors.Is(err, os.ErrNotExist) {
		db, _ := os.Create(dbFile)
		db.Write([]byte("k,v"))
		db.WriteString("\n")
		db.Write([]byte("tt,tt"))
		db.WriteString("\n")
	}

	router := gin.Default()

	router.GET("/set_status", func(ctx *gin.Context) {

		flowName := ctx.Query("flow_name")
		if flowName == "" {
			fmt.Printf("param flow name missing")
			ctx.String(400, "param flow name missing")
			return
		}

		status := ctx.Query("status")
		if status == "" {
			fmt.Printf("param status missing")
			ctx.String(400, "param status missing")
			return
		}

		token := ctx.GetHeader("X-FnF-Http-Callback-Task-Token")
		if token == "" {
			fmt.Printf("header token missing")
			ctx.String(400, "header token missing")
			return
		}

		dbSet(fmt.Sprintf("biz@@%s@@%s", flowName, accountID), status)
		dbSet(fmt.Sprintf("token@@%s@@%s", flowName, accountID), token)

		ctx.String(200, "OK")
		return
	})

	router.GET("/get_order_status", func(ctx *gin.Context) {

		flowName := ctx.Query("flow_name")
		if flowName == "" {
			fmt.Printf("param flow name missing")
			ctx.String(400, "param flow name missing")
			return
		}

		get, err := dbGet(fmt.Sprintf("biz@@%s@@%s", flowName, accountID))
		if err == nil {
			ctx.String(200, get)
			return
		} else {
			ctx.String(400, "查询错误")
			return
		}
	})

	router.GET("/generate_gift_code", func(ctx *gin.Context) {

		flowName := ctx.Query("flow_name")
		if flowName == "" {
			fmt.Printf("param flow name missing")
			ctx.String(400, "param flow name missing")
			return
		}

		giftCode := genGiftCode()
		bizValue := fmt.Sprintf("flow@@%s@@%s", flowName, accountID)

		vexists := dbExistKey(bizValue)
		if vexists {
			fmt.Printf("flow重复提交生成兑换码 %s", bizValue)

			get, _ := dbGet(bizValue)
			rst, _ := strings.CutPrefix(get, "p")
			ctx.String(400, "单次体验仅限一次兑换，本Flow兑换码 %s", rst)
			return
		}

		dbSet(fmt.Sprintf("p%s", giftCode), bizValue)
		dbSet(bizValue, fmt.Sprintf("p%s", giftCode))

		fmt.Printf("生成code并存储 code %s bizValue %s", giftCode, bizValue)
		fmt.Println()

		ctx.String(200, giftCode)
		return
	})

	router.GET("/verify_gift_code", func(ctx *gin.Context) {

		giftCode := ctx.Query("gift_code")
		if giftCode == "" {
			fmt.Printf("param gift code missing")
			ctx.String(400, "param gift code missing")
			return
		}

		pexists := dbExistKey(fmt.Sprintf("p%s", giftCode))
		if !pexists {
			ctx.String(400, "无效兑换码 %s", giftCode)
			return
		}

		cexists := dbExistKey(fmt.Sprintf("c%s", giftCode))
		if cexists {
			ctx.String(400, "重复兑换 %s", giftCode)
			return
		}

		dbSet(fmt.Sprintf("c%s", giftCode), "ok")

		fmt.Printf("核销成功 %s", giftCode)
		fmt.Println()
		ctx.String(200, "核销成功")
		return
	})

	router.Run(":9000")
}

/*
*
生成一个不重复的code
*/
func genGiftCode() string {

	var code string
	for code = genLen6Code(); dbExistKey(fmt.Sprintf("p%s", code)); {
		code = genLen6Code()
	}

	return code

}

func genLen6Code() string {
	numeric := [10]byte{0, 1, 2, 3, 4, 5, 6, 7, 8, 9}
	r := len(numeric)

	var sb strings.Builder
	for i := 0; i < 6; i++ {
		fmt.Fprintf(&sb, "%d", numeric[rand.Intn(r)])
	}
	return sb.String()
}

func dbExistKey(key string) bool {
	file, _ := os.ReadFile(dbFile)

	var kvs []kv
	if err := csvutil.Unmarshal(file, &kvs); err != nil {
		fmt.Println("error:", err)
	}
	kvmap := make(map[string]string)
	for _, kvi := range kvs {
		kvmap[kvi.K] = kvi.V
	}

	_, ok := kvmap[key]
	return ok
}

func dbGet(key string) (string, error) {

	file, _ := os.ReadFile(dbFile)

	var kvs []kv
	if err := csvutil.Unmarshal(file, &kvs); err != nil {
		return "", fmt.Errorf("db file unmarshal error")
	}

	kvmap := make(map[string]string)
	for _, kvi := range kvs {
		kvmap[kvi.K] = kvi.V
	}

	rst, ok := kvmap[key]
	if ok {
		return rst, nil
	} else {
		return "", fmt.Errorf("db get error")
	}

}

func dbSet(key, value string) {

	file, _ := os.ReadFile(dbFile)

	var kvs []kv
	csvutil.Unmarshal(file, &kvs)
	//fmt.Println(err)

	kvmap := make(map[string]string)
	for _, kvi := range kvs {
		kvmap[kvi.K] = kvi.V
	}

	kvmap[key] = value

	var newKvs []kv
	for k, v := range kvmap {
		newKvs = append(newKvs, kv{
			K: k,
			V: v,
		})
	}

	marshal, _ := csvutil.Marshal(newKvs)
	//fmt.Println(err)

	os.WriteFile(dbFile, marshal, 0777)

}
